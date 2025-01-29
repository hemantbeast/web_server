import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { MESSAGE } from '../../../utils/constants.util';

export class CheckUsernameDto {
  // Swagger
  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    required: true,
  })

  // Validation
  @Length(6, 30, { message: MESSAGE.USERNAME_LENGTH_NOT_VALID })
  @IsNotEmpty({ message: MESSAGE.USER_NAME_ERROR })
  readonly username: string;
}
