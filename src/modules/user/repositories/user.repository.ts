import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async getOne(where: Prisma.UserWhereInput): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where,
    });
  }

  async getMany(where: Prisma.UserWhereInput = {}): Promise<User[]> {
    return await this.prisma.user.findMany({
      where,
    });
  }

  async deleteOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }
}
