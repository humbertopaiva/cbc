import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client as MinioClient } from 'minio';
import { randomUUID } from 'crypto';

@Injectable()
export class FileUploadService implements OnModuleInit {
  private readonly logger = new Logger(FileUploadService.name);
  private bucket: string;

  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>('S3_BUCKET', 'cubos-movies');

    const endPoint = this.configService.get<string>('S3_HOST', 'minio');
    const port = this.configService.get<string>('S3_PORT', '9000');

    this.logger.log(`MinIO Client initialized for bucket: ${this.bucket}`);
    this.logger.log(`EndPoint: ${endPoint}, Port: ${port}`);
  }

  async onModuleInit() {
    await this.createBucketIfNotExists();
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      // Verificar se o bucket existe
      const exists = await this.minioClient.bucketExists(this.bucket);

      if (!exists) {
        // Criar o bucket se não existir
        await this.minioClient.makeBucket(this.bucket, '');
        this.logger.log(`Bucket "${this.bucket}" created successfully`);

        // Definir política de acesso público para o bucket
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(policy));
        this.logger.log(`Public policy set for bucket "${this.bucket}"`);
      }
    } catch (error) {
      this.logger.error(
        `Error creating bucket: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getPresignedUploadUrl(
    folder: string,
    filename: string,
  ): Promise<{ url: string; key: string }> {
    try {
      const extension = filename.split('.').pop() || '';
      const key = `${folder}/${randomUUID()}.${extension}`;

      // Gerar URL pré-assinado com expiração de 1 hora (3600 segundos)
      let url = await this.minioClient.presignedPutObject(this.bucket, key, 3600);

      // Substituir 'minio' por 'localhost' na URL
      url = url.replace(/http:\/\/minio/g, 'http://localhost');

      this.logger.log(`Generated presigned URL for ${key}: ${url}`);

      return {
        url,
        key,
      };
    } catch (error) {
      this.logger.error(
        `Error generating presigned URL: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(
        `Could not generate presigned URL: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  getFileUrl(key: string): string {
    // Sempre use 'localhost' para o host externo
    const endPoint = 'localhost';
    const port = this.configService.get<string>('S3_PORT', '9000');
    const useSSL = false; // Altere conforme sua configuração

    const protocol = useSSL ? 'https' : 'http';
    return `${protocol}://${endPoint}:${port}/${this.bucket}/${key}`;
  }
}
