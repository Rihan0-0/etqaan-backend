import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Batch extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: {
      attendance: { type: Number, default: 0.2 },
      memorization: { type: Number, default: 0.4 },
      revision: { type: Number, default: 0.2 },
      exams: { type: Number, default: 0.2 },
    },
    required: true,
  })
  rankingWeights: {
    attendance: number;
    memorization: number;
    revision: number;
    exams: number;
  };

}

export const BatchSchema = SchemaFactory.createForClass(Batch);
