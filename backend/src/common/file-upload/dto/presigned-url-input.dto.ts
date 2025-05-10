import { Field, InputType } from '@nestjs/graphql';
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
