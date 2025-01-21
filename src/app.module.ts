import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './services/users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/web_db'),
    UserModel,
  ],
})
export class AppModule {}
