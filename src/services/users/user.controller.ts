import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<JSON> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<JSON> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JSON> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<JSON> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
