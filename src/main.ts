import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './common/interceptors/exception.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MESSAGE } from './utils/constants.util';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const error = errors.find((value) => value.constraints != null);

        if (error == undefined) {
          return new BadRequestException(MESSAGE.ERROR_MSG);
        }

        const message = Object.values(error.constraints ?? []).join(', ');
        return new BadRequestException(message);
      },
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
