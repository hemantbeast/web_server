import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUtil } from '../../utils/response.util';
import { MESSAGE } from '../../utils/constants.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUsers(): Promise<JSON> {
    const data: User[] = await this.userModel.find().select(['-__v']).exec();
    return ResponseUtil.successResponse<User[]>(data);
  }

  async createUser(createUserDto: CreateUserDto): Promise<JSON> {
    await this.userModel.create(createUserDto);
    return ResponseUtil.successResponse<boolean>(
      true,
      MESSAGE.USER_ADDED_SUCCESS,
    );
  }

  async getUserById(id: string): Promise<JSON> {
    const user: User | null = await this.userModel.findOne({ _id: id }).exec();

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
