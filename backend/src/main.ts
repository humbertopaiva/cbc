import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: ['https://cb-front.limei.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000, // 10MB
      maxFiles: 10,
    }),
  );

  const port = process.env.PORT || 4000;
  // Converter para número se for string
  const portNumber = typeof port === 'string' ? parseInt(port, 10) : port;

  await app.listen(portNumber);
  logger.log(`🚀 Application is running on: http://localhost:${portNumber}/graphql`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
