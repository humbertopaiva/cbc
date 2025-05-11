import { Field, ObjectType } from '@nestjs/graphql';
import { Movie } from '../entities/movie.entity';

@ObjectType()
export class MovieEdge {
  @Field(() => Movie)
  node: Movie;

  @Field(() => String)
  cursor: string;
}
