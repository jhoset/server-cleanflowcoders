import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Global API Prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  //? DTO Validation - Trandformation Setup
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,

    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  // Set Global Timezone from ENV
  process.env.TZ = process.env.TIMEZONE;

  //? Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('CleanFlowCoders - API')
    .setDescription('API Description')
    .setVersion('1.0')
    .addServer(`https://localhost:${process.env.PORT}/`, 'Local Environment')
    .addServer('https://production.our-api.com/', 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT);
  console.log(`>>> App Running on port ${process.env.PORT}`)
}
bootstrap();
