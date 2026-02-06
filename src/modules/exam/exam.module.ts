import { Module } from '@nestjs/common';
import { ExamController } from './controllers/exam.controller';
import { ExamService } from './services/exam.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
