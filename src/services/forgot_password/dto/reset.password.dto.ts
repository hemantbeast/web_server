import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class ResetPasswordDto {
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
    example: 'P@ssw0rd',
    description: 'Password of user',
    required: true,
  })

  // Validations
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: MESSAGE.PASSWORD_NOT_VALID,
    },
  )
  @IsNotEmpty({ message: MESSAGE.PASSWORD_ERROR })
  readonly newPassword: string;

  // Swagger
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Confirm password of user',
    required: true,
  })

  // Validations
  @IsNotEmpty({ message: MESSAGE.CONFIRM_PASSWORD_ERROR })
  readonly confirmPassword: string;
}
