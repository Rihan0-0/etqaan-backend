import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ahmed Ali' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '2015-05-15' })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({ enum: Gender, example: Gender.male })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'Mohamed Ali', required: false })
  @IsString()
  @IsOptional()
  guardian_name?: string;

  @ApiProperty({ example: '01012345678', required: false })
  @IsString()
  @IsOptional()
  guardian_phone?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Optional User ID if student has an account',
  })
  @IsNumber()
  @IsOptional()
  user_id?: number;
}
