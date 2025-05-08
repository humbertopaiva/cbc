import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieOrderByInput } from './movie-order-by.input';

@InputType()
export class MoviesPaginationInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  first?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  after?: string;

  @Field(() => MovieOrderByInput, { nullable: true })
  @ValidateNested()
  @Type(() => MovieOrderByInput)
  @IsOptional()
  orderBy?: MovieOrderByInput;
}
