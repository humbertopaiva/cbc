import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

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
  @IsEnum(MovieOrderField)
  field: MovieOrderField;

  @Field(() => OrderDirection)
  @IsEnum(OrderDirection)
  direction: OrderDirection;
}
