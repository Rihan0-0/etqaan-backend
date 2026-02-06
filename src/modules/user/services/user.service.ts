import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto, currentUserRole: Role): Promise<User> {
    // Check if email exists
    const existingUser = await this.userRepo.getOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // RBAC Logic for creation
    if (
      currentUserRole !== Role.super_admin &&
      currentUserRole !== Role.admin
    ) {
      throw new ForbiddenException(
        'You do not have permission to create users',
      );
    }

    // Admin cannot create Super Admin
    if (currentUserRole === Role.admin && dto.role === Role.super_admin) {
      throw new ForbiddenException('Admins cannot create Super Admins');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userRepo.createOne({
      ...dto,
      password: hashedPassword,
    });
  }

  async deleteUser(
    id: number,
    currentUserId: number,
    currentUserRole: Role,
  ): Promise<User> {
    const userToDelete = await this.userRepo.getOne({ id });
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    // Self-deletion check
    if (userToDelete.id === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // RBAC Logic for deletion
    if (currentUserRole === Role.super_admin) {
      // Super Admin can delete anyone (except self, handled above)
    } else if (currentUserRole === Role.admin) {
      // Admin cannot delete Super Admin
      if (userToDelete.role === Role.super_admin) {
        throw new ForbiddenException('Admins cannot delete Super Admins');
      }
      // Admin cannot delete other Admins (User requirement: "bc no admin can delete his account" - implies protection for admins?
      // Usually admins can delete lower roles. User said "make like there is an super admin bc no admin can delete his account".
      // This phrasing suggests a Super Admin is needed specifically to handle Admin lifecycles or to be the ONE who can't be deleted?
      // I'll assume Admin can delete Student/Sheikh. Admin vs Admin?
      // Prudent approach: Admin cannot delete other Admins. Only Super Admin can delete Admins.
      if (userToDelete.role === Role.admin) {
        throw new ForbiddenException('Admins cannot delete other Admins');
      }
    } else {
      throw new ForbiddenException(
        'You do not have permission to delete users',
      );
    }

    // We don't have delete method in repository yet. We need it.
    // For now I'll create the logic but I need to update repo.
    // Since repo only has createOne, getOne, getMany.
    // I need to add delete method to UserRepository.

    return await this.userRepo.deleteOne({ id });
  }
}
