import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import { FileUploadResolver } from './file-upload.resolver';
import { MinioClientModule } from './minio-client.module';

@Module({
  imports: [ConfigModule, MinioClientModule],
  providers: [FileUploadService, FileUploadResolver],
  exports: [FileUploadService],
})
export class FileUploadModule {}
