import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  badRequestSwagger,
  internalServerSwagger,
  successSwagger,
} from '../../utils/swagger.util';
import { loginResponse } from './dto/login.response.dto';
import { MESSAGE } from '../../utils/constants.util';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginService } from './services/login.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignupService } from './services/signup.service';
import { CheckEmailDto } from './dto/check.email.dto';
import { CheckUsernameDto } from './dto/check.username.dto';
import { VerifyAccountDto } from './dto/verify.account.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly signupService: SignupService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(loginResponse, MESSAGE.LOGIN_SUCCESS))
  @ApiResponse(badRequestSwagger(MESSAGE.LOGIN_ERROR))
  @ApiResponse(internalServerSwagger())
  async login(@Body() login: LoginRequestDto): Promise<JSON> {
    return await this.loginService.login(login);
  }

  @Post('signUp')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true, MESSAGE.EMAIL_SENT))
  @ApiResponse(badRequestSwagger(MESSAGE.ALREADY_REGISTER))
  @ApiResponse(internalServerSwagger())
  async signUp(@Body() createUserDto: CreateUserDto): Promise<JSON> {
    return await this.signupService.signup(createUserDto);
  }

  @Post('checkEmail')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true))
  @ApiResponse(badRequestSwagger(MESSAGE.EMAIL_ALREADY_EXIST))
  @ApiResponse(internalServerSwagger())
  async checkEmail(@Body() checkEmailDto: CheckEmailDto): Promise<JSON> {
    return await this.signupService.checkEmail(checkEmailDto);
  }

  @Post('checkUsername')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true, MESSAGE.USERNAME_AVAILABLE))
  @ApiResponse(badRequestSwagger(MESSAGE.USERNAME_ALREADY_EXIST))
  @ApiResponse(internalServerSwagger())
  async checkUsername(
    @Body() checkUsernameDto: CheckUsernameDto,
  ): Promise<JSON> {
    return await this.signupService.checkUsername(checkUsernameDto);
  }

  @Post('verifyAccount')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(loginResponse, MESSAGE.ACCOUNT_VERIFIED))
  @ApiResponse(badRequestSwagger(MESSAGE.OTP_INVALID))
  @ApiResponse(internalServerSwagger())
  async verifyAccount(@Body() request: VerifyAccountDto): Promise<JSON> {
    return await this.signupService.verifyAccount(request);
  }

  @Post('resendOtp')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true, MESSAGE.EMAIL_SENT))
  @ApiResponse(badRequestSwagger(MESSAGE.USER_NOT_FOUND_ERROR))
  @ApiResponse(internalServerSwagger())
  async resendOtp(@Body() request: CheckEmailDto): Promise<JSON> {
    return await this.signupService.resendOtp(request);
  }
}
