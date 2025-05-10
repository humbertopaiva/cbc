import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { PresignedUrlResponse } from './dto/presigned-url-response.dto';
import { PresignedUrlInput } from './dto/presigned-url.dto';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => PresignedUrlResponse)
  @UseGuards(GqlAuthGuard)
  async getPresignedUploadUrl(
    @Args('input') input: PresignedUrlInput,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponse> {
    const { folder, filename } = input;

    // Obter URL pré-assinada do serviço de upload, passando o usuário atual
    const result = await this.fileUploadService.getPresignedUploadUrl(folder, filename, user);

    // Construir a resposta com URL pré-assinada, chave e URL final do arquivo
    return {
      presignedUrl: result.url,
      key: result.key,
      fileUrl: this.fileUploadService.getFileUrl(result.key),
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteFile(@Args('key') key: string, @CurrentUser() user: User): Promise<boolean> {
    return this.fileUploadService.deleteFile(key, user);
  }
}
