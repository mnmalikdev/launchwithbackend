import { Module } from '@nestjs/common';
import { FilesController } from './controller/google-upload.controller';
import { GoogleDriveService } from './google-cloud.service';

@Module({
  controllers: [FilesController],
  providers: [GoogleDriveService],
})
export class GoogleDriveModule {}
