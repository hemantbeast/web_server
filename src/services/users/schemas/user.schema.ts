import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ type: Number })
  passwordOtp?: number;

  @Prop({ type: Date })
  passwordExpires?: Date;

  @Prop({ type: Boolean, default: false })
  isOtpVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
