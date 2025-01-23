import {
  IsAlpha,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  // Swagger
  @ApiPropertyOptional({ example: 'John', description: 'First name of user' })

  // Validations
  @IsOptional()
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.FIRST_NAME_MIN_ERROR })
  readonly firstName?: string;

  // Swagger
  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of user' })

  // Validations
  @IsOptional()
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.LAST_NAME_MIN_ERROR })
  readonly lastName?: string;

  // Swagger
  @ApiPropertyOptional({ example: 'P@ssw0rd', description: 'Password of user' })

  // Validations
  @IsOptional()
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
  readonly password?: string;

  // Swagger
  @ApiPropertyOptional({ example: '9876543210', description: 'Phone number of user' })
  // Validations
  @IsOptional()
  readonly phoneNumber?: string;
}
