import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AttendanceStatus {
  present = 'present',
  absent = 'absent',
  late = 'late',
  excused = 'excused',
}

class StudentAttendanceDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jadeedRange?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  jadeedGrade?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  murajaRange?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  murajaGrade?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  behaviorNote?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bonus?: number;
}

export class SaveBatchAttendanceDto {
  @ApiProperty()
  @IsInt()
  batchId: number;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ type: [StudentAttendanceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  records: StudentAttendanceDto[];
}
