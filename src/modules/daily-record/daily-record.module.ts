import { Module } from '@nestjs/common';
import { DailyRecordController } from './controllers/daily-record.controller';
import { DailyRecordService } from './services/daily-record.service';

@Module({
  controllers: [DailyRecordController],
  providers: [DailyRecordService],
})
export class DailyRecordModule {}
