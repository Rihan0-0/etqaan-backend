import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { updatedAt: 'updatedAt', createdAt: false } })
export class BatchScore extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  score: number;

  @Prop({
    type: {
      attendance: { type: Number, default: 0 },
      memorization: { type: Number, default: 0 },
      revision: { type: Number, default: 0 },
      exams: { type: Number, default: 0 },
    },
  })
  breakdown: {
    attendance: number;
    memorization: number;
    revision: number;
    exams: number;
  };

  @Prop()
  lastEvaluatedAt?: Date;
}

export const BatchScoreSchema = SchemaFactory.createForClass(BatchScore);
