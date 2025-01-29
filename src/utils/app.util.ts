import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUtil {
  generateOtp(): number {
    return Math.floor(Math.random() * 900000) + 100000;
  }
}
