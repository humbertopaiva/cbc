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
import { Upload } from '../scalars/upload.scalar';
import { GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class CreateMovieInput {
  @Field()
  @IsString()
  title: string;

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
  imageFile?: Upload;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  backdropFile?: Upload;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
