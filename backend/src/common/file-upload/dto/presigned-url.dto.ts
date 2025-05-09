import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  contentType?: string;
}
