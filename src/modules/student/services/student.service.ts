import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    return this.prisma.student.create({
      data: {
        ...dto,
        dob: dto.dob ? new Date(dto.dob) : null,
      },
    });
  }

  async findAll(query: { phone?: string; name?: string }): Promise<Student[]> {
    const { phone, name } = query;
    return this.prisma.student.findMany({
      where: {
        guardian_phone: phone ? { contains: phone } : undefined,
        full_name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: number, data: Partial<CreateStudentDto>): Promise<Student> {
    await this.findOne(id);
    return this.prisma.student.update({
      where: { id },
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : undefined,
      },
    });
  }

  async remove(id: number): Promise<Student> {
    await this.findOne(id);
    return this.prisma.student.delete({ where: { id } });
  }

  async getHistory(studentId: number, batchId?: number) {
    await this.findOne(studentId);

    const whereClause = {
      batch_student: {
        student_id: studentId,
        ...(batchId ? { batch_id: batchId } : {}),
      },
    };

    const dailyRecords = await this.prisma.dailyRecord.findMany({
      where: whereClause,
      orderBy: { record_date: 'desc' },
      include: {
        batch_student: {
          include: {
            batch: true,
          },
        },
      },
    });

    const examResults = await this.prisma.examResult.findMany({
      where: whereClause,
      orderBy: { exam: { exam_date: 'desc' } },
      include: {
        exam: true,
        batch_student: {
          include: {
            batch: true,
          },
        },
      },
    });

    return { dailyRecords, examResults };
  }
}
