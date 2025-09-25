import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MemberRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}


@Schema({ timestamps: { createdAt: 'joinedAt', updatedAt: false } })
export class BatchMembership extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, enum: MemberRole })
  role: MemberRole;

}

export const BatchMembershipSchema =
  SchemaFactory.createForClass(BatchMembership);
