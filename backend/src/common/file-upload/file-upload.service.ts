import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET', 'cubos-movies-humberto');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY', ''),
      },
      endpoint: this.configService.get<string>('AWS_ENDPOINT'), // Optional: apenas para S3 compatível
      forcePathStyle: this.configService.get<boolean>('S3_FORCE_PATH_STYLE', false), // true para MinIO/LocalStack
    });

    this.logger.log(`S3 Client initialized for bucket: ${this.bucket}`);
  }

  // Gerar uma chave única para upload
  private generateKey(folder: string, userId: string, filename: string): string {
    const extension = filename.split('.').pop() || '';

    // Começar com 'imagens/', depois folder, userId e o nome do arquivo com UUID
    return `imagens/${folder}/${userId}/${randomUUID()}.${extension}`;
  }

  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    user: User,
  ): Promise<{ url: string; key: string }> {
    try {
      // Gerar uma chave que inclui o caminho imagens/, o folder, e o ID do usuário para isolamento
      const key = this.generateKey(folder, user.id, filename);

      // Criar o comando de upload
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: `image/${filename.split('.').pop()}`,
        Metadata: {
          'user-id': user.id, // Adicionar metadata com ID do usuário para rastreabilidade
        },
      });

      // Gerar URL pré-assinado com expiração de 5 minutos (300 segundos)
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

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
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');

    const customEndpoint = this.configService.get<string>('AWS_PUBLIC_ENDPOINT');
    if (customEndpoint) {
      return `${customEndpoint}/${this.bucket}/${key}`;
    }

    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  private canDeleteFile(key: string, userId: string): boolean {
    return key.includes(`/${userId}/`);
  }

  async deleteFile(key: string, user: User): Promise<boolean> {
    try {
      if (!this.canDeleteFile(key, user.id)) {
        this.logger.warn(`Unauthorized delete attempt by user ${user.id} for file ${key}`);
        throw new ForbiddenException('You do not have permission to delete this file');
      }

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
