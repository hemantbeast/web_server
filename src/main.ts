import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './common/interceptors/exception.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MESSAGE } from './utils/constants.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validation pipe
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

  // Custom exception
  app.useGlobalFilters(new CustomExceptionFilter());

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Profile')
    .setDescription('Handling user profile API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  console.log('Swagger running on https://localhost:3000/api-docs');

  await app.register(helmet);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
