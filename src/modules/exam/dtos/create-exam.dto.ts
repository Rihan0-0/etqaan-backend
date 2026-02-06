import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  batchId: number;

  @ApiProperty({ example: 'Mid-Term Exam' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsOptional()
  maxScore?: number;

  @ApiProperty({ example: '2026-02-15' })
  @IsDateString()
  @IsNotEmpty()
  examDate: string;
}
