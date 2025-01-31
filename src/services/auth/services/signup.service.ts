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
import { CheckEmailDto } from '../dto/check.email.dto';
import { CheckUsernameDto } from '../dto/check.username.dto';
import { VerifyAccountDto } from '../dto/verify.account.dto';
import { LoginResponseDto } from '../dto/login.response.dto';
import { instanceToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(TempUser.name)
    private readonly tempUserModel: Model<TempUser>,

    private readonly cryptoUtil: CryptoUtil,
    private readonly appUtil: AppUtil,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  // Signup user
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

  // Check email
  async checkEmail(checkEmailDto: CheckEmailDto): Promise<JSON> {
    const user: UserDocument | null = await this.userModel.findOne({
      email: checkEmailDto.email.toLowerCase(),
    });

    if (user) {
      throw new BadRequestException(MESSAGE.EMAIL_ALREADY_EXIST);
    } else {
      return ResponseUtil.successResponse(true);
    }
  }

  // Check username
  async checkUsername(checkUsernameDto: CheckUsernameDto): Promise<JSON> {
    const user: UserDocument | null = await this.userModel.findOne({
      username: checkUsernameDto.username,
    });

    if (user) {
      throw new BadRequestException(MESSAGE.USERNAME_ALREADY_EXIST);
    } else {
      return ResponseUtil.successResponse(true, MESSAGE.USERNAME_AVAILABLE);
    }
  }

  // Verify user account
  async verifyAccount(request: VerifyAccountDto): Promise<JSON> {
    if (request.otp.toString().length != 6) {
      throw new BadRequestException(MESSAGE.OTP_INVALID);
    }

    const tempUser: TempUser | null = await this.tempUserModel.findOne({
      email: request.email.toLowerCase(),
      otp: request.otp,
    });

    if (!tempUser) {
      throw new BadRequestException(MESSAGE.OTP_INVALID);
    }

    const user = new CreateUserDto({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: tempUser.email.toLowerCase(),
      password: tempUser.password,
      username: tempUser.username,
    });

    // Save user details
    await this.userModel.create(user);

    // Delete temp user
    await this.tempUserModel.deleteOne({ _id: tempUser._id });

    // Get the user created
    const userData: UserDocument | null = await this.userModel.findOne({
      email: request.email.toLowerCase(),
    });

    const data = new LoginResponseDto({
      id: userData?._id.toString(),
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      username: userData?.username,
    });
    data.token = await this.jwtService.signAsync(instanceToPlain(data));

    return ResponseUtil.successResponse<LoginResponseDto>(
      data,
      MESSAGE.ACCOUNT_VERIFIED,
    );
  }
}
