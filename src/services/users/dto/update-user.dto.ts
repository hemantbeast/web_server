import {
  IsAlpha,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class UpdateUserDto {
  @IsOptional()
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.FIRST_NAME_MIN_ERROR })
  readonly firstName?: string;

  @IsOptional()
  @IsAlpha()
  @MinLength(2, { message: MESSAGE.LAST_NAME_MIN_ERROR })
  readonly lastName?: string;

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

  @IsOptional()
  readonly phoneNumber?: string;
}
