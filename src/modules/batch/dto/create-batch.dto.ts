import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  term_id: number;

  @ApiProperty({ example: 'Batch A - Quran' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mon/Wed 5PM', required: false })
  @IsString()
  @IsOptional()
  schedule_description?: string;
}
