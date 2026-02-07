import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SaveBatchAttendanceDto,
  AttendanceStatus,
} from './dtos/save-attendance.dto';
import { Grade } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async saveAttendance(dto: SaveBatchAttendanceDto) {
    const { batchId, date, records } = dto;

    // Verify batch exists
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
    });
    if (!batch) throw new NotFoundException('Batch not found');

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each student record
    for (const record of records) {
      try {
        // Find the batch_student record
        const batchStudent = await this.prisma.batchStudent.findFirst({
          where: {
            batch_id: batchId,
            student_id: record.studentId,
          },
        });

        if (!batchStudent) {
          results.failed++;
          results.errors.push(
            `Student ${record.studentId} not found in batch ${batchId}`,
          );
          continue;
        }

        // Check if daily record already exists for this date
        const existingRecord = await this.prisma.dailyRecord.findFirst({
          where: {
            batch_student_id: batchStudent.id,
            record_date: new Date(date),
          },
        });

        const data = {
          attendance_status: record.status as any, // Cast to Prisma enum if needed
          jadeed_range: record.jadeedRange,
          jadeed_grade: record.jadeedGrade
            ? this.mapGrade(record.jadeedGrade)
            : null,
          muraja_range: record.murajaRange,
          muraja_grade: record.murajaGrade
            ? this.mapGrade(record.murajaGrade)
            : null,
          behavior_note: record.behaviorNote,
          bonus_points: record.bonus || 0,
        };

        let dailyRecord;
        if (existingRecord) {
          // Update existing
          dailyRecord = await this.prisma.dailyRecord.update({
            where: { id: existingRecord.id },
            data,
          });
        } else {
          // Create new
          dailyRecord = await this.prisma.dailyRecord.create({
            data: {
              batch_student_id: batchStudent.id,
              record_date: new Date(date),
              ...data,
            },
          });
        }

        // Recalculate Student Points
        // 1. Attendance Points
        let points = 0;
        if (record.status === AttendanceStatus.present) points += 10;
        else if (record.status === AttendanceStatus.late) points += 5;

        // 2. Jadeed Points
        if (record.jadeedGrade) {
          points += this.getGradePoints(record.jadeedGrade);
        }

        // 3. Muraja Points
        if (record.murajaGrade) {
          points += this.getGradePoints(record.murajaGrade);
        }

        // 4. Bonus Points
        if (record.bonus) {
          points += record.bonus;
        }

        // Update BatchStudent total points
        // We need to sum ALL daily records for this student in this batch
        const allRecords = await this.prisma.dailyRecord.findMany({
          where: { batch_student_id: batchStudent.id },
        });

        // Calculate total points from all records
        let totalPoints = 0;
        for (const r of allRecords) {
          let p = 0;
          if (r.attendance_status === 'present') p += 10;
          else if (r.attendance_status === 'late') p += 5;

          if (r.jadeed_grade) p += this.getGradePointsFromEnum(r.jadeed_grade);
          if (r.muraja_grade) p += this.getGradePointsFromEnum(r.muraja_grade);
          if (r.bonus_points) p += r.bonus_points;

          totalPoints += p;
          console.log(
            `[Score Calc] Student ${batchStudent.student_id}: Rec ${r.id}, Att ${r.attendance_status}, Jadeed ${r.jadeed_grade}, Muraja ${r.muraja_grade}, Bonus ${r.bonus_points} => Record Points: ${p}`,
          );
        }

        console.log(
          `[Score Calc] Student ${batchStudent.student_id}: Total Calculated Points: ${totalPoints}`,
        );

        await this.prisma.batchStudent.update({
          where: { id: batchStudent.id },
          data: { league_points: totalPoints },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to save record for student ${record.studentId}: ${error.message}`,
        );
      }
    }

    return results;
  }

  // Helper to map score to Grade enum if needed, or just return the grade enum
  // Assuming the Prisma schema uses an enum for Grade (excellent, very_good, etc.)
  // But the DTO sends a number. Let's look at schema again.
  // Schema says `jadeed_grade` is type `Grade` enum.
  // We need a mapping logic.

  private mapGrade(score: number): Grade {
    if (score >= 90) return Grade.excellent;
    if (score >= 80) return Grade.very_good;
    if (score >= 70) return Grade.good;
    if (score >= 50) return Grade.acceptable;
    if (score >= 30) return Grade.weak;
    return Grade.redo;
  }

  private getGradePoints(score: number): number {
    if (score >= 90) return 20; // Excellent
    if (score >= 80) return 15; // Very Good
    if (score >= 70) return 10; // Good
    if (score >= 50) return 5; // Acceptable
    return 0;
  }

  private getGradePointsFromEnum(grade: Grade): number {
    switch (grade) {
      case Grade.excellent:
        return 20;
      case Grade.very_good:
        return 15;
      case Grade.good:
        return 10;
      case Grade.acceptable:
        return 5;
      default:
        return 0;
    }
  }
}
