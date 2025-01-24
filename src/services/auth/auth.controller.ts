import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  badRequestSwagger,
  internalServerSwagger,
  successSwagger,
} from '../../utils/swagger.util';
import { loginResponse } from './dto/login.response.dto';
import { MESSAGE } from '../../utils/constants.util';
import { ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(loginResponse, MESSAGE.LOGIN_SUCCESS))
  @ApiResponse(badRequestSwagger(MESSAGE.LOGIN_ERROR))
  @ApiResponse(internalServerSwagger())
  async login(@Body() login: LoginRequestDto): Promise<JSON> {
    return await this.authService.login(login);
  }
}
