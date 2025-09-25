import { Module } from '@nestjs/common';
import { BatchController } from './controllers/batch.controller';
import { BatchService } from './services/batch.service';

@Module({
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
