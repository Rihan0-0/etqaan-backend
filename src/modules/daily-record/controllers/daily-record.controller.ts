import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DailyRecordService } from '../services/daily-record.service';
import { CreateDailyRecordDto } from '../dtos/create-daily-record.dto';

@ApiTags('Daily Records')
@Controller('daily-records')
export class DailyRecordController {
  constructor(private readonly dailyRecordService: DailyRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a daily record and update points' })
  create(@Body() dto: CreateDailyRecordDto) {
    return this.dailyRecordService.create(dto);
  }
}
