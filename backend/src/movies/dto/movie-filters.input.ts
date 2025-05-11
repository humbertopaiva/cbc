import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

// Certifique-se que o MovieStatus está registrado como enum para o GraphQL
// Se já estiver registrado na entidade, você pode remover esta linha
// registerEnumType(MovieStatus, { name: 'MovieStatus' });

@InputType()
export class MovieFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minDuration?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDuration?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDateFrom?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDateTo?: string;

  // Aqui está o problema - precisamos garantir que o GraphQL reconheça o enum
  @Field(() => String, { nullable: true })
  @IsOptional()
  status?: string; // Usando string em vez do enum para simplificar

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  language?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  genreIds?: string[];
}
