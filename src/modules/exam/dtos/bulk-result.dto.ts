import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class StudentResult {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  batchStudentId: number;

  @ApiProperty({ example: 95.5 })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}

export class BulkExamResultDto {
  @ApiProperty({ type: [StudentResult] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentResult)
  results: StudentResult[];
}
