import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Expose } from 'class-transformer';

export const loginResponse = {
  id: new Types.ObjectId().toString(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export class LoginResponseDto {
  constructor(partial?: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 'id',
    description: 'User ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'firstName',
    description: 'First name',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: 'lastName',
    description: 'Last name',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    example: 'email',
    description: 'Email address',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'Username',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'token',
    description: 'Access Token',
  })
  token: string;
}
