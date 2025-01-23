import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoUtil {
  private readonly ENCRYPTION_KEY: string;
  private readonly IV_LENGTH = 16;

  constructor(private readonly configService: ConfigService) {
    this.ENCRYPTION_KEY =
      this.configService.get<string>('ENCRYPTION_KEY') || 'default_secret_key';

    if (this.ENCRYPTION_KEY.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 characters long');
    }
  }

  encryptPassword(password: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      iv,
    );

    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptPassword(encryptedPassword: string): string {
    const [iv, encrypted] = encryptedPassword.split(':');
    if (!iv || !encrypted) {
      throw new Error('Invalid encrypted password format');
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      Buffer.from(iv, 'hex'),
    );

    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
