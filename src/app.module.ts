import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './services/users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';
import { ForgotPasswordModule } from './services/forgot_password/forgot.password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'local.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB'),
      }),
    }),
    AuthModule,
    ForgotPasswordModule,
    UserModel,
  ],
})
export class AppModule {}
