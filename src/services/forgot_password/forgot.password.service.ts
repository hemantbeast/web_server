import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckEmailDto } from '../auth/dto/check.email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { MESSAGE } from '../../utils/constants.util';
import { AppUtil } from '../../utils/app.util';
import { MailService } from '../mail/mail.service';
import { ResponseUtil } from '../../utils/response.util';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly appUtil: AppUtil,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(request: CheckEmailDto): Promise<JSON> {
    const user: UserDocument | null = await this.userModel.findOne({
      email: request.email.toLowerCase(),
    });

    if (!user) {
      throw new BadRequestException(MESSAGE.USER_NOT_FOUND_ERROR);
    }

    user.passwordOtp = this.appUtil.generateOtp();
    user.passwordExpires = DateTime.utc().plus({ days: 1 }).toISO();
    await user.save();

    // Send verification mail
    await this.mailService.prepareAndSendMail(
      request.email.toLowerCase(),
      'Web Server: Forgot Password',
      'forgot_password.html',
      { PASSWORD: user.passwordOtp.toString() },
    );

    return ResponseUtil.successResponse(
      true,
      MESSAGE.FORGOT_PASSWORD_INSTRUCTION,
    );
  }
}
