import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoUtil } from '../../utils/crypto.util';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AppUtil } from '../../utils/app.util';
import { TempUser, TempUserSchema } from './schemas/temp.user.schema';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TempUser.name, schema: TempUserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    CryptoUtil,
    LoginService,
    SignupService,
    JwtStrategy,
    AppUtil,
    MailService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
