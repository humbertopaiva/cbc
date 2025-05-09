import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      isGlobal: false,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>('S3_HOST', 'minio'),
        port: parseInt(configService.get<string>('S3_PORT', '9000'), 10),
        useSSL: false, // Mudar para true se usar HTTPS
        accessKey: configService.get<string>('S3_ACCESS_KEY', 'minioadmin'),
        secretKey: configService.get<string>('S3_SECRET_KEY', 'minioadmin'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestMinioModule],
})
export class MinioClientModule {}
