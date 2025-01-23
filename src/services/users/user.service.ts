import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUtil } from '../../utils/response.util';
import { MESSAGE } from '../../utils/constants.util';
import { CryptoUtil } from '../../utils/crypto.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cryptoUtils: CryptoUtil,
  ) {}

  async getUsers(): Promise<JSON> {
    const data: User[] = await this.userModel
      .find()
      .select(['-__v', '-password'])
      .exec();

    return ResponseUtil.successResponse<User[]>(data);
  }

  async createUser(createUserDto: CreateUserDto): Promise<JSON> {
    const user: User | null = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (user != null) {
      throw new BadRequestException(MESSAGE.USER_ALREADY_EXIST);
    }

    const password = this.cryptoUtils.encryptPassword(createUserDto.password);

    const newUser = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email.toLowerCase(),
      password: password,
      username: createUserDto.username,
    };

    await this.userModel.create(newUser);
    return ResponseUtil.successResponse<boolean>(
      true,
      MESSAGE.USER_ADDED_SUCCESS,
    );
  }

  async getUserById(id: string): Promise<JSON> {
    const userId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

    if (!userId) {
      throw new BadRequestException(MESSAGE.USER_ID_NOT_VALID);
    }

    const user: User | null = await this.userModel
      .findOne({ _id: id })
      .select(['-__v', '-password'])
      .exec();

    if (!user) {
      throw new BadRequestException(MESSAGE.USER_NOT_FOUND_ERROR);
    }
    return ResponseUtil.successResponse<User>(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<JSON> {
    const user: User | null = await this.userModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();

    if (!user) {
      throw new BadRequestException(MESSAGE.ERROR_MSG);
    }

    return ResponseUtil.successResponse<boolean>(
      true,
      MESSAGE.USER_UPDATED_SUCCESS,
    );
  }
}
