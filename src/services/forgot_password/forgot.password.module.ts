import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './forgot.password.controller';
import { ForgotPasswordService } from './forgot.password.service';
import { AppUtil } from '../../utils/app.util';
import { MailService } from '../mail/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { CryptoUtil } from '../../utils/crypto.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService, AppUtil, CryptoUtil, MailService],
})
export class ForgotPasswordModule {}
