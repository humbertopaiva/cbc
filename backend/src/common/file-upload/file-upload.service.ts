import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
    this.bucket = this.configService.get<string>('S3_BUCKET', 'cubos-movies');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY', ''),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY', ''),
      },
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      forcePathStyle: true, // Necessário para MinIO e outros serviços compatíveis com S3
    });
  }

  async uploadFile(file: Promise<FileUpload>, folder = 'uploads'): Promise<string> {
    try {
      const { createReadStream, filename, mimetype } = await file;
      const extension = filename.split('.').pop() || '';
      const key = `${folder}/${randomUUID()}.${extension}`;

      const fileStream = createReadStream();

      const uploadParams = {
        Bucket: this.bucket,
        Key: key,
        Body: fileStream,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Construir a URL completa do arquivo
      return this.getFileUrl(key);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error uploading file: ${error.message}`);
        throw new Error(`Could not upload file: ${error.message}`);
      }
      this.logger.error('Unknown error uploading file');
      throw new Error('Could not upload file due to an unknown error');
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const key = this.getKeyFromUrl(fileUrl);

      if (!key) {
        throw new Error(`Could not extract key from URL: ${fileUrl}`);
      }

      const deleteParams = {
        Bucket: this.bucket,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      this.logger.log(`File deleted successfully: ${key}`);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting file: ${error.message}`);
      } else {
        this.logger.error('Unknown error deleting file');
      }
      return false;
    }
  }

  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<{ url: string; key: string }> {
    try {
      const extension = filename.split('.').pop() || '';
      const key = `${folder}/${randomUUID()}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

      this.logger.log(`Generated presigned URL for uploading: ${key}`);

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        url: signedUrl,
        key,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error generating presigned URL: ${error.message}`);
        throw new Error(`Could not generate presigned URL: ${error.message}`);
      }
      this.logger.error('Unknown error generating presigned URL');
      throw new Error('Could not generate presigned URL due to an unknown error');
    }
  }

  getFileUrl(key: string): string {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    return `${endpoint}/${this.bucket}/${key}`;
  }

  getKeyFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === this.bucket);

      if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
        return null;
      }

      return urlParts.slice(bucketIndex + 1).join('/');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error extracting key from URL: ${error.message}`);
      } else {
        this.logger.error('Unknown error extracting key from URL');
      }
      return null;
    }
  }
}
