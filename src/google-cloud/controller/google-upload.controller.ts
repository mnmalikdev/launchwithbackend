import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from '../google-cloud.service';

@Controller('files')
export class FilesController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<{ fileId: string }> {
    const folderId = '1fxgvSIrudEQxG2rl8FTbMDQoRbi2QvAO';
    const fileId = await this.googleDriveService.uploadFile(file, folderId);
    return { fileId };
  }
}
