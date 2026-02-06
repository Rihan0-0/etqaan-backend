import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus, Grade } from '@prisma/client';

export class CreateDailyRecordDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  batchStudentId: number;

  @ApiProperty({ example: '2026-02-07' })
  @IsDateString()
  @IsNotEmpty()
  recordDate: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.present })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  attendanceStatus: AttendanceStatus;

  @ApiProperty({ example: 'Surah Al-Fatiha', required: false })
  @IsString()
  @IsOptional()
  jadeedRange?: string;

  @ApiProperty({ enum: Grade, example: Grade.excellent, required: false })
  @IsEnum(Grade)
  @IsOptional()
  jadeedGrade?: Grade;

  @ApiProperty({ example: 'Juz 30', required: false })
  @IsString()
  @IsOptional()
  murajaRange?: string;

  @ApiProperty({ enum: Grade, example: Grade.very_good, required: false })
  @IsEnum(Grade)
  @IsOptional()
  murajaGrade?: Grade;

  @ApiProperty({ example: 'Good behavior', required: false })
  @IsString()
  @IsOptional()
  behaviorNote?: string;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @IsOptional()
  bonusPoints?: number;
}
