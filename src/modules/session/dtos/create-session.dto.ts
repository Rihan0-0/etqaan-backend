import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionStatus } from '../enums/session-status.enum';

class EvaluationDto {
  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  evaluation: string;

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  score: number;
}

export class CreateSessionDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsMongoId()
  batchId: string;

  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @IsNotEmpty()
  @IsEnum(SessionStatus)
  status: SessionStatus;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EvaluationDto)
  memorization: EvaluationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EvaluationDto)
  revision: EvaluationDto;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
