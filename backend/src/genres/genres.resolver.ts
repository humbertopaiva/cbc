import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Genre)
export class GenresResolver {
  constructor(private readonly genresService: GenresService) {}

  @Query(() => [Genre])
  @UseGuards(GqlAuthGuard)
  async genres(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Query(() => Genre)
  @UseGuards(GqlAuthGuard)
  async genre(@Args('id', { type: () => ID }) id: string): Promise<Genre> {
    return this.genresService.findById(id);
  }
}
