import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Global API Prefix
  app.setGlobalPrefix('api/v1');
  //? DTO Validation - Trandformation Setup
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,

    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  await app.listen(process.env.PORT);
  console.log(`>>> App Running on port ${process.env.PORT}`)
}
bootstrap();
