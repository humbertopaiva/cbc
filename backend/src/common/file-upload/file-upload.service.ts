import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET', 'cubos-movies');

    // Configurar o cliente AWS S3
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY', ''),
      },
      endpoint: this.configService.get<string>('AWS_ENDPOINT'), // Optional: apenas para S3 compatível ou LocalStack
      forcePathStyle: this.configService.get<boolean>('S3_FORCE_PATH_STYLE', false), // true para MinIO/LocalStack
    });

    this.logger.log(`S3 Client initialized for bucket: ${this.bucket}`);
  }

  async onModuleInit() {
    await this.createBucketIfNotExists();
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      // Verificar se o bucket existe
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket "${this.bucket}" already exists`);
      } catch (error) {
        // Se o bucket não existir, criar
        this.logger.log(`Creating bucket "${this.bucket}"...`);
        await this.s3Client.send(
          new CreateBucketCommand({
            Bucket: this.bucket,
            // Se estiver usando um bucket público, adicione as configurações de CORS aqui
          }),
        );

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

        await this.s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: this.bucket,
            Policy: JSON.stringify(policy),
          }),
        );

        this.logger.log(`Bucket "${this.bucket}" created successfully with public read policy`);
      }
    } catch (error) {
      this.logger.error(
        `Error managing bucket: ${error instanceof Error ? error.message : String(error)}`,
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

      // Criar o comando de upload
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: `image/${extension}`, // Ajuste conforme necessário
      });

      // Gerar URL pré-assinado com expiração de 1 hora (3600 segundos)
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

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
    // Para Amazon S3 padrão
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');

    // Se estiver usando um endpoint personalizado
    const customEndpoint = this.configService.get<string>('AWS_PUBLIC_ENDPOINT');
    if (customEndpoint) {
      return `${customEndpoint}/${this.bucket}/${key}`;
    }

    // URL padrão para Amazon S3
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      this.logger.log(`Successfully deleted file: ${key}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error deleting file: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }
}
