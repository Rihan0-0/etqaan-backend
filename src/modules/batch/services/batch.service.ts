import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBatchDto } from '../dto/create-batch.dto';
import { Batch, Grade, AttendanceStatus } from '@prisma/client';

@Injectable()
export class BatchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBatchDto): Promise<Batch> {
    const batch = await this.prisma.batch.create({
      data: {
        term_id: dto.term_id,
        name: dto.name,
        schedule_description: dto.schedule_description,
      },
    });

    // Assign sheikhs if provided
    if (dto.sheikh_ids?.length) {
      await Promise.all(
        dto.sheikh_ids.map((sheikhId) =>
          this.prisma.batchSheikh.create({
            data: { batch_id: batch.id, sheikh_id: sheikhId },
          }),
        ),
      );
    }

    return this.findOne(batch.id);
  }

  async findAll(): Promise<Batch[]> {
    return this.prisma.batch.findMany({
      include: {
        term: true,
        batch_sheikhs: { include: { sheikh: true } },
        _count: { select: { batch_students: true, batch_sheikhs: true } },
      },
    });
  }

  async findOne(id: number) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        batch_students: { include: { student: true } },
        batch_sheikhs: { include: { sheikh: true } },
        exams: true,
      },
    });
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }

  async update(id: number, data: Partial<CreateBatchDto>): Promise<Batch> {
    await this.findOne(id);
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Batch> {
    await this.findOne(id);
    return this.prisma.batch.delete({ where: { id } });
  }

  async enrollStudent(batchId: number, studentId: number) {
    // Check if already enrolled
    const existing = await this.prisma.batchStudent.findFirst({
      where: { batch_id: batchId, student_id: studentId },
    });
    if (existing)
      throw new BadRequestException('Student already enrolled in this batch');

    return this.prisma.batchStudent.create({
      data: {
        batch_id: batchId,
        student_id: studentId,
      },
    });
  }

  async assignSheikh(batchId: number, sheikhId: number) {
    const existing = await this.prisma.batchSheikh.findFirst({
      where: { batch_id: batchId, sheikh_id: sheikhId },
    });
    if (existing)
      throw new BadRequestException(
        'Sheikh already assigned details to this batch',
      );

    return this.prisma.batchSheikh.create({
      data: {
        batch_id: batchId,
        sheikh_id: sheikhId,
      },
    });
  }

  async getLeaderboard(batchId: number) {
    const students = await this.prisma.batchStudent.findMany({
      where: { batch_id: batchId },
      include: { student: true },
      orderBy: { league_points: 'desc' },
    });

    return students.map((bs, index) => ({
      rank: index + 1,
      name: bs.student.full_name,
      points: bs.league_points,
      studentId: bs.student_id,
      batchStudentId: bs.id,
    }));
  }

  async bulkEnroll(batchId: number, studentIds: number[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const studentId of studentIds) {
      try {
        // Check if already enrolled
        const existing = await this.prisma.batchStudent.findFirst({
          where: { batch_id: batchId, student_id: studentId },
        });

        if (!existing) {
          await this.prisma.batchStudent.create({
            data: {
              batch_id: batchId,
              student_id: studentId,
            },
          });
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Student ${studentId} is already enrolled`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to enroll student ${studentId}: ${error.message}`,
        );
      }
    }

    return results;
  }
  async recalculateScores(batchId: number) {
    const batchStudents = await this.prisma.batchStudent.findMany({
      where: { batch_id: batchId },
      include: { daily_records: true },
    });

    for (const bs of batchStudents) {
      let total = 0;
      for (const r of bs.daily_records) {
        // Attendance
        if (r.attendance_status === AttendanceStatus.present) total += 10;
        else if (r.attendance_status === AttendanceStatus.late) total += 5;

        // Jadeed
        if (r.jadeed_grade)
          total += this.getGradePointsFromEnum(r.jadeed_grade);

        // Muraja
        if (r.muraja_grade)
          total += this.getGradePointsFromEnum(r.muraja_grade);

        // Bonus
        if (r.bonus_points) total += r.bonus_points;
      }

      await this.prisma.batchStudent.update({
        where: { id: bs.id },
        data: { league_points: total },
      });
    }

    return { success: true, count: batchStudents.length };
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
