import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../entities/user.entity';
import { Prisma, Role } from '@prisma/client';

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
      orderBy: { created_at: 'desc' },
    });
  }

  async deleteOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }

  async count(where: Prisma.UserWhereInput = {}): Promise<number> {
    return await this.prisma.user.count({ where });
  }

  async countByRole(): Promise<Record<string, number>> {
    const roles = [Role.super_admin, Role.admin, Role.sheikh, Role.student];
    const counts: Record<string, number> = {};
    for (const role of roles) {
      counts[role] = await this.prisma.user.count({ where: { role } });
    }
    return counts;
  }
}
