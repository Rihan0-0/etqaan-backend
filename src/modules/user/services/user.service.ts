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

  async getAll(currentUserRole: Role): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.getMany();
    // Remove hashed passwords
    // Super admin can see all plain passwords
    // Admin can only see passwords of sheikh and student users
    return users.map(({ password, plain_password, ...user }) => {
      // Super admin sees all passwords
      if (currentUserRole === Role.super_admin) {
        return { ...user, plain_password };
      }
      // Admin cannot see admin or super_admin passwords
      if (user.role === Role.admin || user.role === Role.super_admin) {
        return { ...user, plain_password: null };
      }
      // Admin can see sheikh/student passwords
      return { ...user, plain_password };
    });
  }

  async getStats(): Promise<{
    totalUsers: number;
    byRole: Record<string, number>;
  }> {
    const totalUsers = await this.userRepo.count();
    const byRole = await this.userRepo.countByRole();
    return { totalUsers, byRole };
  }

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
      plain_password: dto.password, // Store plain password for admin viewing
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
      // Admin cannot delete other Admins
      if (userToDelete.role === Role.admin) {
        throw new ForbiddenException('Admins cannot delete other Admins');
      }
    } else {
      throw new ForbiddenException(
        'You do not have permission to delete users',
      );
    }

    return await this.userRepo.deleteOne({ id });
  }
}
