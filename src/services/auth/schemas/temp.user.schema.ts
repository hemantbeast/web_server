import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TempUser extends Document {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: Number })
  otp: number;

  @Prop({
    required: true,
    type: Date,
    expires: 300,
    default: () => new Date(),
  })
  createdAt: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
