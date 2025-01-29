import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from '../../../utils/crypto.util';
import { LoginRequestDto } from '../dto/login.request.dto';
import { MESSAGE } from '../../../utils/constants.util';
import { LoginResponseDto } from '../dto/login.response.dto';
import { instanceToPlain } from 'class-transformer';
import { ResponseUtil } from '../../../utils/response.util';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  async login(login: LoginRequestDto): Promise<JSON> {
    const user: UserDocument | null = await this.userModel
      .findOne({ email: login.email.toLowerCase() })
      .exec();

    if (!user) {
      throw new BadRequestException(MESSAGE.LOGIN_ERROR);
    }

    // Compare password
    const password = this.cryptoUtil.decryptPassword(user.password);
    if (password !== login.password) {
      throw new BadRequestException(MESSAGE.LOGIN_ERROR);
    }

    const data = new LoginResponseDto({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
    data.token = await this.jwtService.signAsync(instanceToPlain(data));

    return ResponseUtil.successResponse<LoginResponseDto>(
      data,
      MESSAGE.LOGIN_SUCCESS,
    );
  }
}
