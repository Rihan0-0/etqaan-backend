import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SessionStatus } from '../enums/session-status.enum';

export type SessionDocument = Session & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Session {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: String, enum: SessionStatus, required: true })
  status: SessionStatus;

  @Prop({
    type: {
      from: { type: String, required: true },
      to: { type: String, required: true },
      evaluation: { type: String, required: true },
      score: { type: Number, min: 0, max: 100, required: true },
    },
    required: true,
    _id: false,
  })
  memorization: {
    from: string;
    to: string;
    evaluation: string;
    score: number;
  };

  @Prop({
    type: {
      from: { type: String, required: true },
      to: { type: String, required: true },
      evaluation: { type: String, required: true },
      score: { type: Number, min: 0, max: 100, required: true },
    },
    required: true,
    _id: false,
  })
  revision: {
    from: string;
    to: string;
    evaluation: string;
    score: number;
  };

  @Prop({ type: String })
  notes?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
