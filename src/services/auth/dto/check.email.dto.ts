import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class CheckEmailDto {
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
}
