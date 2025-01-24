import { MESSAGE } from '../../../utils/constants.util';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  // Swagger
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email',
    required: true,
  })

  // Validations
  @IsString()
  @IsEmail({ allow_underscores: true }, { message: MESSAGE.EMAIL_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.EMAIL_ERROR })
  readonly email: string;

  // Swagger
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Password',
    required: true,
  })

  // Validations
  @IsString()
  @IsNotEmpty({ message: MESSAGE.PASSWORD_ERROR })
  readonly password: string;
}
