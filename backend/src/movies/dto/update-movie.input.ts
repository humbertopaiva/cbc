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
} from 'class-validator';

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
  imageUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'A URL do backdrop deve ser válida' })
  backdropUrl?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;
}
