import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
} from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class CreateUserDto {
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.FIRST_NAME_MIN_ERROR })
  @IsNotEmpty({ message: MESSAGE.FIRST_NAME_ERROR })
  readonly firstName: string;

  @IsAlpha()
  @MinLength(2, { message: MESSAGE.LAST_NAME_MIN_ERROR })
  @IsNotEmpty({ message: MESSAGE.LAST_NAME_ERROR })
  readonly lastName: string;

  @IsEmail({ allow_underscores: true }, { message: MESSAGE.EMAIL_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.EMAIL_ERROR })
  readonly email: string;

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

  @Length(6, 30, { message: MESSAGE.USERNAME_LENGTH_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.USER_NAME_ERROR })
  readonly username: string;
}
