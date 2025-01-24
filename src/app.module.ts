import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './services/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'local.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/web_db'),
    AuthModule,
    UserModel,
  ],
})
export class AppModule {}
