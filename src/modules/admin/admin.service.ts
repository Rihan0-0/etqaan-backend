import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalBatches: number;
  totalSheikhs: number;
  totalAdmins: number;
  usersByRole: Record<string, number>;
  recentActivity: {
    todayRecords: number;
    weekRecords: number;
  };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<AdminStats> {
    // Get all counts in parallel
    const [
      totalUsers,
      totalStudents,
      totalBatches,
      sheikhs,
      admins,
      superAdmins,
      students,
      todayRecords,
      weekRecords,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.student.count(),
      this.prisma.batch.count(),
      this.prisma.user.count({ where: { role: Role.sheikh } }),
      this.prisma.user.count({ where: { role: Role.admin } }),
      this.prisma.user.count({ where: { role: Role.super_admin } }),
      this.prisma.user.count({ where: { role: Role.student } }),
      this.prisma.dailyRecord.count({
        where: {
          record_date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.dailyRecord.count({
        where: {
          record_date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalBatches,
      totalSheikhs: sheikhs,
      totalAdmins: admins + superAdmins,
      usersByRole: {
        super_admin: superAdmins,
        admin: admins,
        sheikh: sheikhs,
        student: students,
      },
      recentActivity: {
        todayRecords,
        weekRecords,
      },
    };
  }
}
