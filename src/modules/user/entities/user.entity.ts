// Lib
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Enums
import { UserGender } from 'src/common/enums/user-gender.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true })
  phone?: string;

  @Prop()
  parentPhone?: string;

  @Prop({ enum: UserGender })
  gender?: UserGender;

  @Prop({ type: Date })
  birthDate?: Date;

  @Prop()
  profileAvatar?: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Batch' }] }) // May Be updated in future
  joinedBatches: MongooseSchema.Types.ObjectId[];

  @Prop([String])
  qualifications?: string[];

  @Prop()
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
