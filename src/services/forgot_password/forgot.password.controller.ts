import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  badRequestSwagger,
  internalServerSwagger,
  successSwagger,
} from '../../utils/swagger.util';
import { MESSAGE } from '../../utils/constants.util';
import { CheckEmailDto } from '../auth/dto/check.email.dto';
import { ForgotPasswordService } from './forgot.password.service';
import { VerifyAccountDto } from '../auth/dto/verify.account.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

@Controller('forgot_password')
export class ForgotPasswordController {
  constructor(private forgotPasswordService: ForgotPasswordService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true, MESSAGE.FORGOT_PASSWORD_INSTRUCTION))
  @ApiResponse(badRequestSwagger(MESSAGE.USER_NOT_FOUND_ERROR))
  @ApiResponse(internalServerSwagger())
  async forgotPassword(@Body() request: CheckEmailDto): Promise<JSON> {
    return await this.forgotPasswordService.forgotPassword(request);
  }

  @Post('verifyOTP')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true))
  @ApiResponse(badRequestSwagger(MESSAGE.USER_OR_OTP_INVALID))
  @ApiResponse(internalServerSwagger())
  async verifyOtp(@Body() request: VerifyAccountDto): Promise<JSON> {
    return await this.forgotPasswordService.verifyOTP(request);
  }

  @Post('resetPassword')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(successSwagger(true))
  @ApiResponse(badRequestSwagger(MESSAGE.USER_OR_OTP_INVALID))
  @ApiResponse(internalServerSwagger())
  async resetPassword(@Body() request: ResetPasswordDto): Promise<JSON> {
    return await this.forgotPasswordService.resetPassword(request);
  }
}
