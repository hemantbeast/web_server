import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class VerifyAccountDto {
  // Swagger
  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: true,
  })

  // Validation
  @IsString()
  @IsEmail({ allow_underscores: true }, { message: MESSAGE.EMAIL_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.EMAIL_ERROR })
  readonly email: string;

  // Swagger
  @ApiProperty({
    description: 'OTP',
    example: '123456',
    required: true,
  })

  // Validation
  @IsNumber()
  @IsNotEmpty({ message: MESSAGE.OTP_EMPTY })
  readonly otp: number;
}
