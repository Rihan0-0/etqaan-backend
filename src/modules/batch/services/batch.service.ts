import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBatchDto } from '../dto/create-batch.dto';
import { Batch } from '@prisma/client';

@Injectable()
export class BatchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBatchDto): Promise<Batch> {
    return this.prisma.batch.create({
      data: dto,
    });
  }

  async findAll(): Promise<Batch[]> {
    return this.prisma.batch.findMany({
      include: { term: true, batch_sheikhs: true },
    });
  }

  async findOne(id: number) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        batch_students: { include: { student: true } },
        batch_sheikhs: { include: { sheikh: true } },
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
}
