import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, ConfigModule, CommonModule]
})
export class UserModule { }
