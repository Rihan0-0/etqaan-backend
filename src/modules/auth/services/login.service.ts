// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Lib
import * as bcrypt from 'bcryptjs';

// Schema
import { User } from '../../user/entities/user.entity';

// Dtos
import { LoginDto } from '../dtos/login.dto';

// Repositories
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  // Validate user credentials
  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepo.getOne({
      email: loginDto.email,
    });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password))
    ) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Login: Generate and return a JWT
  async login(loginDto: LoginDto) {
    const user: User = await this.validateUser(loginDto);

    return {
      name: user.name,
      // username: user.username, // Username removed from schema
      role: user.role,
      accessToken: this.jwtService.sign({ id: user.id }),
    };
  }
}
