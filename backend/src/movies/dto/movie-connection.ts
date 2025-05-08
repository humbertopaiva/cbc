import { Field, ObjectType, Int } from '@nestjs/graphql';
import { MovieEdge } from './movie-edge';
import { PageInfo } from './page-info';

@ObjectType()
export class MovieConnection {
  @Field(() => [MovieEdge])
  edges: MovieEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}
