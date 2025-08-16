import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Entities
import { User, UserDocument } from '../../user/entities/user.entity';

// Enums
import { UserRole } from 'src/common/enums/user-role.enum';

// Dtos
import { RegisterForStudentDto } from '../dtos/register-for-student.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class RegisterForStudentService {
  constructor(private readonly userRepo: UserRepository) {}

  async registerStudent(data: RegisterForStudentDto): Promise<User> {
    // Check if user exists
    const exists = await this.userRepo.getOne({
      email: data.email,
      isActive: true,
    });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.createOne({
      ...data,
      password: hashedPassword,
      role: UserRole.STUDENT,
      isActive: true,
    });

    // Create user
    return { ...user.toObject(), password: undefined } as User; // Exclude password from response
  }
}
