// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Lib
import { ExtractJwt, Strategy } from 'passport-jwt';

// usecase

//Entity
import { User } from '../user/entities/user.entity';

// Repositories
import { UserRepository } from '../user/repositories/user.repository';

interface AuthPayload {
  id: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret') || 'defaultSecretKey',
    });
  }

  // Validate
  async validate(payload: AuthPayload): Promise<User> {
    try {
      const user = await this.userRepo.getOne({
        id: payload.id,
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
  }
}
