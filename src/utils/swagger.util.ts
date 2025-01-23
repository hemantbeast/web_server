import { HttpStatus } from '@nestjs/common';
import { MESSAGE } from './constants.util';

export const successSwagger = <T>(
  obj: T,
  message: string = MESSAGE.SUCCESS,
) => ({
  status: HttpStatus.OK,
  description: 'Success',
  schema: {
    example: {
      success: true,
      data: obj,
      message,
    },
  },
});

export const badRequestSwagger = (message: string = MESSAGE.ERROR_MSG) => ({
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad request',
  schema: {
    example: {
      success: false,
      data: null,
      message,
    },
  },
});

export const notFoundSwagger = (message: string = MESSAGE.ERROR_MSG) => ({
  status: HttpStatus.NOT_FOUND,
  description: 'Not Found',
  schema: {
    example: {
      success: false,
      data: null,
      message,
    },
  },
});

export const internalServerSwagger = (message: string = MESSAGE.ERROR_MSG) => ({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
  schema: {
    example: {
      success: false,
      data: null,
      message,
    },
  },
});
