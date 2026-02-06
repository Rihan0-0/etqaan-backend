import { Body, Controller, Param, Post } from '@nestjs/common';
import { BatchService } from '../services/batch.service';
import { CreateBatchDto } from '../dto/create-batch.dto';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  // @Post()
  // async createBatch(@Body() createBatchDto: CreateBatchDto) {
  //     return await this.batchService.createBatch(createBatchDto);
  // }

  // @Post('add-members/:batchId')
  // async addMembers(
  //     @Body() body: { members: { memberId: string, role: string }[] },
  //     @Param('batchId') batchId: string) {
  //     return await this.batchService.addMembers(batchId, body.members);
  // }
}
