import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto } from '../dtos/create-exam.dto';
import { BulkExamResultDto } from '../dtos/bulk-result.dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: {
        batch_id: dto.batchId,
        title: dto.title,
        max_score: dto.maxScore,
        exam_date: new Date(dto.examDate),
      },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        exam_results: true,
      },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async addResults(examId: number, dto: BulkExamResultDto) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    // Transaction: Save Results + Update Points check
    return this.prisma.$transaction(async (prisma) => {
      const createdResults: any[] = [];

      for (const result of dto.results) {
        // 1. Create Result Record
        const examResult = await prisma.examResult.create({
          data: {
            exam_id: examId,
            batch_student_id: result.batchStudentId,
            score: result.score,
          },
        });
        createdResults.push(examResult);

        // 2. Add Score to League Points (Assuming 1 score = 1 point, or just adding raw score)
        // User said: "Add the score directly to the student's league_points"
        await prisma.batchStudent.update({
          where: { id: result.batchStudentId },
          data: {
            league_points: { increment: Math.round(result.score) }, // Keeping points integer
          },
        });
      }

      return createdResults;
    });
  }
}
