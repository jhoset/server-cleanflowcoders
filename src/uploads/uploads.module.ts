import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadsController } from './uploads.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [ AuthModule ],
  providers: [UploadService],
  controllers: [UploadsController],
})
export class UploadsModule {}
