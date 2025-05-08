import { Field, InputType, ID, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  Max,
  IsDateString,
  IsArray,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class UpdateMovieInput {
  @Field(() => ID)
  @IsUUID('4')
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  originalTitle?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  budget?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  genreIds?: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  imageFile?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  backdropFile?: Promise<FileUpload>;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
