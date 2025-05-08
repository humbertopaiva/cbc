import { Module } from '@nestjs/common';
import { FileUploadModule } from './file-upload/file-upload.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [FileUploadModule, EmailModule],
  exports: [FileUploadModule, EmailModule],
})
export class CommonModule {}
