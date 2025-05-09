import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileUploadService } from './file-upload.service';

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => PresignedUrlResponse)
  async getPresignedUploadUrl(
    @Args('input') input: PresignedUrlInput,
  ): Promise<PresignedUrlResponse> {
    const { folder, filename, contentType } = input;

    const result = await this.fileUploadService.getPresignedUploadUrl(
      folder,
      filename,
      contentType,
    );

    return {
      presignedUrl: result.url,
      key: result.key,
      fileUrl: this.fileUploadService.getFileUrl(result.key),
    };
  }
}

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class PresignedUrlInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  folder: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  contentType: string;
}

@ObjectType()
export class PresignedUrlResponse {
  @Field()
  presignedUrl: string;

  @Field()
  key: string;

  @Field()
  fileUrl: string;
}
