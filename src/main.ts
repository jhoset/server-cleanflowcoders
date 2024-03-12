import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
