import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  MinLength,
} from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // Swagger
  @ApiProperty({
    example: 'John',
    description: 'First name of user',
    required: true,
  })

  // Validations
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.FIRST_NAME_MIN_ERROR })
  @IsNotEmpty({ message: MESSAGE.FIRST_NAME_ERROR })
  readonly firstName: string;

  // Swagger
  @ApiProperty({
    example: 'Doe',
    description: 'Last name of user',
    required: true,
  })

  // Validations
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.LAST_NAME_MIN_ERROR })
  @IsNotEmpty({ message: MESSAGE.LAST_NAME_ERROR })
  readonly lastName: string;

  // Swagger
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of user',
    required: true,
  })

  // Validations
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
      message: MESSAGE.PASSWORD_ERROR,
    },
  )
  @IsNotEmpty({ message: MESSAGE.PASSWORD_ERROR })
  readonly password: string;

  // Swagger
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of user',
    required: true,
  })

  // Validations
  @Length(6, 30, { message: MESSAGE.USERNAME_LENGTH_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.USER_NAME_ERROR })
  readonly username: string;
}
