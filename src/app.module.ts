import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, JoiValidationSchema } from './config';
import { PrismaService } from './prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
