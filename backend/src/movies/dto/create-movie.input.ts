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
  IsUrl,
  IsEnum,
} from 'class-validator';
import { MovieStatus } from '../entities/movie.entity';

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tagline?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  budget?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  revenue?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  profit?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @Field({ nullable: true })
  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  language?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  popularity?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  voteCount?: number;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  genreIds?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
  imageUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageKey?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'A URL do backdrop deve ser válida' })
  backdropUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  backdropKey?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
