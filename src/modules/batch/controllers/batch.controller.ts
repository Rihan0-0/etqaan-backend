import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BatchService } from '../services/batch.service';
import { CreateBatchDto } from '../dto/create-batch.dto';
import { EnrollStudentDto } from '../dto/enroll-student.dto';
import { AssignSheikhDto } from '../dto/assign-sheikh.dto';

@ApiTags('Batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new batch' })
  create(@Body() dto: CreateBatchDto) {
    return this.batchService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  findAll() {
    return this.batchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update batch' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateBatchDto>,
  ) {
    return this.batchService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete batch' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.remove(id);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll a student in a batch' })
  enroll(@Param('id', ParseIntPipe) id: number, @Body() dto: EnrollStudentDto) {
    return this.batchService.enrollStudent(id, dto.studentId);
  }

  @Post(':id/assign-sheikh')
  @ApiOperation({ summary: 'Assign a sheikh to a batch' })
  assignSheikh(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignSheikhDto,
  ) {
    return this.batchService.assignSheikh(id, dto.sheikhId);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard for a batch' })
  getLeaderboard(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.getLeaderboard(id);
  }
}
