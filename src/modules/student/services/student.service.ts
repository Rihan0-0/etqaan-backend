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
}
