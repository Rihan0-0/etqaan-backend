// Nest
import { Module } from '@nestjs/common';

// Lib
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StudentModule } from './modules/student/student.module';
import { BatchModule } from './modules/batch/batch.module';
import { DailyRecordModule } from './modules/daily-record/daily-record.module';
import { ExamModule } from './modules/exam/exam.module';

// Controllers
import { AppController } from './app.controller';

//Services
import { AppService } from './app.service';

// Config
import config from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: config, // loads from config/index.ts
    }),
    PrismaModule,
    EventEmitterModule.forRoot(),
    StudentModule,
    BatchModule,
    DailyRecordModule,
    ExamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
