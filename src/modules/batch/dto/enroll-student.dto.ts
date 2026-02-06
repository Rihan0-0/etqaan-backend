import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  studentId: number;
}
