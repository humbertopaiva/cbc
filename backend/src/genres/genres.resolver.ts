import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';

@Resolver(() => Genre)
export class GenresResolver {
  constructor(private readonly genresService: GenresService) {}

  @Query(() => [Genre])
  async genres(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Query(() => Genre)
  async genre(@Args('id', { type: () => ID }) id: string): Promise<Genre> {
    return this.genresService.findById(id);
  }
}
