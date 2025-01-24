import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MESSAGE } from '../../utils/constants.util';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {
  badRequestSwagger,
  internalServerSwagger,
  successSwagger,
} from '../../utils/swagger.util';
import { mockedUser, mockedUsers } from './mock/user.mock';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse(successSwagger(true, MESSAGE.USER_ADDED_SUCCESS))
  @ApiResponse(badRequestSwagger())
  @ApiResponse(internalServerSwagger())
  async create(@Body() createUserDto: CreateUserDto): Promise<JSON> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiResponse(successSwagger(mockedUsers))
  @ApiResponse(badRequestSwagger('No users found.'))
  @ApiResponse(internalServerSwagger())
  async findAll(): Promise<JSON> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiResponse(successSwagger(mockedUser(new Types.ObjectId().toString())))
  @ApiResponse(badRequestSwagger(MESSAGE.USER_NOT_FOUND_ERROR))
  @ApiResponse(internalServerSwagger())
  async findOne(@Param('id') id: string): Promise<JSON> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiResponse(successSwagger(true, MESSAGE.USER_UPDATED_SUCCESS))
  @ApiResponse(badRequestSwagger())
  @ApiResponse(internalServerSwagger())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<JSON> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
