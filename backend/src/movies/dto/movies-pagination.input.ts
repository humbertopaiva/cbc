import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

export enum MovieOrderField {
  TITLE = 'TITLE',
  RELEASE_DATE = 'RELEASE_DATE',
  DURATION = 'DURATION',
  RATING = 'RATING',
  CREATED_AT = 'CREATED_AT',
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(MovieOrderField, {
  name: 'MovieOrderField',
});

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

@InputType()
export class MovieOrderByInput {
  @Field(() => MovieOrderField)
  field: MovieOrderField;

  @Field(() => OrderDirection)
  direction: OrderDirection;
}

@InputType()
export class MoviesPaginationInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  first?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => MovieOrderByInput, { nullable: true })
  @IsOptional()
  orderBy?: MovieOrderByInput;
}
