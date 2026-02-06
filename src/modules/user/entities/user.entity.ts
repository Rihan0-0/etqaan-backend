import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  created_at: Date;
}
