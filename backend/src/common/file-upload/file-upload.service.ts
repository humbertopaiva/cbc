import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { randomUUID } from 'crypto';
import { Readable } from 'stream';

interface FileUpload {
  createReadStream: () => Readable;
  filename: string;
  mimetype: string;
  encoding: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET') || 'movies_challenge';
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') || '',
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY') || '',
      },
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      forcePathStyle: true, // Flag para o MinIO local
    });
  }

  async uploadFile(file: Promise<FileUpload>, folder: string = 'uploads'): Promise<string> {
    try {
      const { createReadStream, filename, mimetype } = await file;
      const extension = filename.split('.').pop() || '';
      const key = `${folder}/${randomUUID()}.${extension}`;

      const fileStream: Readable = createReadStream();

      const uploadParams = {
        Bucket: this.bucket,
        Key: key,
        Body: fileStream,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const endpoint = this.configService.get<string>('S3_ENDPOINT');
      return `${endpoint}/${this.bucket}/${key}`;
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Erro ao enviar arquivo: ${error.message}`);
      throw new Error(`Não foi possível enviar o arquivo: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extrair o key da URL
      const key = fileUrl.split('/').slice(-2).join('/');

      const deleteParams = {
        Bucket: this.bucket,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      return true;
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Erro ao deletar arquivo: ${error.message}`);
      return false;
    }
  }
}
