import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';
import { TempUser } from '../schemas/temp.user.schema';
import { CryptoUtil } from '../../../utils/crypto.util';
import { AppUtil } from '../../../utils/app.util';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { MESSAGE } from '../../../utils/constants.util';
import { ResponseUtil } from '../../../utils/response.util';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(TempUser.name) private readonly tempUserModel: Model<TempUser>,
    private readonly cryptoUtil: CryptoUtil,
    private readonly appUtil: AppUtil,
    private readonly mailService: MailService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<JSON> {
    const user: UserDocument | null = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (user != null) {
      throw new BadRequestException(MESSAGE.ALREADY_REGISTER);
    }

    const password = this.cryptoUtil.encryptPassword(createUserDto.password);
    const otp = this.appUtil.generateOtp();

    // Save user details as temporary
    await this.saveOrUpdateTempUser(createUserDto, password, otp);

    await this.mailService.prepareAndSendMail(
      createUserDto.email.toLowerCase(),
      'Web Server: Email verification',
      'otp_verification.html',
      { OTP: otp.toString() },
    );

    return ResponseUtil.successResponse<boolean>(true, MESSAGE.EMAIL_SENT);
  }

  private async saveOrUpdateTempUser(
    request: CreateUserDto,
    password: string,
    otp: number,
  ) {
    const tempUser: TempUser | null = await this.tempUserModel.findOne({
      email: request.email.toLowerCase(),
    });

    if (tempUser) {
      tempUser.firstName = request.firstName;
      tempUser.lastName = request.lastName;
      tempUser.password = password;
      tempUser.otp = otp;

      await tempUser.save();
    } else {
      const newUser = {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email.toLowerCase(),
        username: request.username,
        password: password,
        otp: otp,
      };

      await this.tempUserModel.create(newUser);
    }
  }
}
