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
}
