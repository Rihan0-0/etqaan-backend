import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSheikhDto {
  @ApiProperty({ example: 1, description: 'User ID of the sheikh' })
  @IsInt()
  @IsNotEmpty()
  sheikhId: number;
}
