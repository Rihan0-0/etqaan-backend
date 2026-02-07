import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkEnrollDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of student IDs to enroll',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  studentIds: number[];
}
