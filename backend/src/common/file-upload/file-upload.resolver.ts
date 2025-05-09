import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileUploadService } from './file-upload.service';
import { PresignedUrlResponse } from './dto/presigned-url-response.dto';
import { PresignedUrlInput } from './dto/presigned-url.dto';

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => PresignedUrlResponse)
  async getPresignedUploadUrl(
    @Args('input') input: PresignedUrlInput,
  ): Promise<PresignedUrlResponse> {
    const { folder, filename } = input;

    // Obter URL pré-assinada do serviço de upload
    const result = await this.fileUploadService.getPresignedUploadUrl(folder, filename);

    // Construir a resposta com URL pré-assinada, chave e URL final do arquivo
    return {
      presignedUrl: result.url,
      key: result.key,
      fileUrl: this.fileUploadService.getFileUrl(result.key),
    };
  }
}
