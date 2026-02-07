import { Module } from '@nestjs/common';
import { SessionController } from './controllers/session.controller';
import { SessionService } from './session.service';
import { BatchModule } from '../batch/batch.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, BatchModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
