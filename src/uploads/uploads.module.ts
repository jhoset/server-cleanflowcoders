import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadsController } from './uploads.controller';
@Module({
  providers: [UploadService],
  controllers: [UploadsController],
})
export class UploadsModule {}
