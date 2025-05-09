import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import { FileUploadResolver } from './file-upload.resolver';

@Module({
  imports: [ConfigModule],
  providers: [FileUploadService, FileUploadResolver],
  exports: [FileUploadService],
})
export class FileUploadModule {}
