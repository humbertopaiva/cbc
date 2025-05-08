import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Configurar validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar middleware para uploads de arquivos
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000, // 10MB
      maxFiles: 10,
    }),
  );

  // Obter a porta do ambiente ou usar 4000 como padrão
  const port = process.env.PORT || 4000;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}
void bootstrap();
