import { Injectable } from '@nestjs/common';
import { Session } from './schemas/session.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSessionDto } from './dtos/create-session.dto';
import { BatchService } from '../batch/services/batch.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { scoreEvents } from 'src/common/events/event-constants';
import { SessionCreatedPayload } from 'src/common/events/session/session-created-payload.interface';

@Injectable()
export class SessionService {
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<Session>,
        private batchService: BatchService,
        private eventEmitter: EventEmitter2,
    ) { }
    async create(createSessionDto: CreateSessionDto): Promise<Session> {

        await this.batchService.validateTeacherAndStudent(createSessionDto.batchId, createSessionDto.teacherId, createSessionDto.studentId);
        const session = new this.sessionModel(createSessionDto);
        const savedSession = await session.save();

        const payload: SessionCreatedPayload = {
            batchId: savedSession.batchId.toString(),
            studentId: savedSession.studentId.toString(),
            scores: {
                memorization: savedSession.memorization.score,
                revision: savedSession.revision.score,
            },
            status: savedSession.status,
        }

        this.eventEmitter.emit(scoreEvents.session.sessionCreated, payload);

        return savedSession;
    }
}
