import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { UserGender } from 'src/common/enums/user-gender.enum';

export class RegisterForStudentDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  parentPhone?: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsDateString()
  birthDate: Date;

  @IsNumber()
  @IsOptional()
  profileAvatar?: number;
}
