import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import process from 'node:process';
import { readFile } from 'fs/promises';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      },
      {
        from: configService.get<string>('MAIL_EMAIL'),
      },
    );
  }

  async prepareAndSendMail(
    mail: string,
    subject: string,
    template: string,
    variables: Record<string, string>,
  ) {
    try {
      const fullPath = join(
        __dirname,
        '..',
        '..',
        'common',
        'templates',
        template,
      );

      let data = await readFile(fullPath, 'utf8');

      for (const [key, value] of Object.entries(variables)) {
        data = data.replace(new RegExp(`##${key.toUpperCase()}`, 'g'), value);
      }

      await this.transporter
        .sendMail({
          to: mail,
          subject,
          html: data,
        })
        .then((value) => console.log(value))
        .catch((err) => console.log(err));
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Error reading or processing template: ${e.message}`);
    }
  }
}
