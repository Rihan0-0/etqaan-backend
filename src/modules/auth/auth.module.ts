// NestJs
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { AuthController } from './auth.controller';

//Modules
import { UserModule } from '../user/user.module';

// Services
import { LoginService } from './services/login.service';
import { RegisterForStudentService } from './services/register-for-student.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RegisterForStudentService, LoginService],
})
export class AuthModule {}
