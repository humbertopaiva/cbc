import { Field, InputType, ID, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  IsArray,
  Min,
  IsEnum,
} from 'class-validator';
import { MovieStatus } from '../entities/movie.entity';

@InputType()
export class MovieFiltersInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  minDuration?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  maxDuration?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  releaseDateFrom?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  releaseDateTo?: string;

  @Field({ nullable: true })
  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  language?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  genreIds?: string[];
}
