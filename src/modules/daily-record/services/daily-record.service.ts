import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDailyRecordDto } from '../dtos/create-daily-record.dto';
import { AttendanceStatus, Grade } from '@prisma/client';

@Injectable()
export class DailyRecordService {
  constructor(private readonly prisma: PrismaService) {}

  private calculatePoints(dto: CreateDailyRecordDto): number {
    let points = 0;

    // Attendance Logic
    switch (dto.attendanceStatus) {
      case AttendanceStatus.present:
        points += 5;
        break;
      case AttendanceStatus.late:
        points += 2;
        break;
      case AttendanceStatus.absent:
        points -= 5;
        break;
      default:
        break;
    }

    // Grade Logic (Applied for both Jadeed and Muraja if present)
    const gradePoints = {
      [Grade.excellent]: 20,
      [Grade.very_good]: 15,
      [Grade.good]: 10,
      [Grade.weak]: 0,
      [Grade.redo]: -5,
      [Grade.acceptable]: 5, // Giving intermediate points for acceptable
    };

    if (dto.jadeedGrade && gradePoints[dto.jadeedGrade] !== undefined) {
      points += gradePoints[dto.jadeedGrade];
    }

    if (dto.murajaGrade && gradePoints[dto.murajaGrade] !== undefined) {
      points += gradePoints[dto.murajaGrade];
    }

    // Bonus
    if (dto.bonusPoints) {
      points += dto.bonusPoints;
    }

    return points;
  }

  async create(dto: CreateDailyRecordDto) {
    const pointsToAdd = this.calculatePoints(dto);

    // Transaction to ensure atomicity
    return this.prisma.$transaction(async (prisma) => {
      // 1. Create Record
      const record = await prisma.dailyRecord.create({
        data: {
          batch_student_id: dto.batchStudentId,
          record_date: new Date(dto.recordDate),
          attendance_status: dto.attendanceStatus,
          jadeed_range: dto.jadeedRange,
          jadeed_grade: dto.jadeedGrade,
          muraja_range: dto.murajaRange,
          muraja_grade: dto.murajaGrade,
          behavior_note: dto.behaviorNote,
          bonus_points: dto.bonusPoints,
        },
      });

      // 2. Update Student Score
      await prisma.batchStudent.update({
        where: { id: dto.batchStudentId },
        data: {
          league_points: { increment: pointsToAdd },
        },
      });

      return record;
    });
  }
}
