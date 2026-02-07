import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExamService } from '../services/exam.service';
import { CreateExamDto } from '../dtos/create-exam.dto';
import { BulkExamResultDto } from '../dtos/bulk-result.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  create(@Body() dto: CreateExamDto) {
    return this.examService.create(dto);
  }

  @Post(':id/results')
  @ApiOperation({ summary: 'Bulk add exam results and update points' })
  addResults(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BulkExamResultDto,
  ) {
    return this.examService.addResults(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }
}
