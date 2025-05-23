import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { MovieFiltersInput } from './dto/movie-filters.input';
import { MoviesPaginationInput } from './dto/movies-pagination.input';
import { MovieConnection } from './dto/movie-connection';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Query(() => Movie)
  @UseGuards(GqlAuthGuard)
  async movie(@Args('id', { type: () => ID }) id: string): Promise<Movie> {
    return this.moviesService.findById(id);
  }

  @Query(() => MovieConnection)
  @UseGuards(GqlAuthGuard)
  async movies(
    @CurrentUser() user: User,
    @Args('filters', { nullable: true }) filters?: MovieFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: MoviesPaginationInput,
  ): Promise<MovieConnection> {
    return this.moviesService.findAll(filters, pagination, user);
  }

  @Mutation(() => Movie)
  @UseGuards(GqlAuthGuard)
  async createMovie(
    @Args('input') input: CreateMovieInput,
    @CurrentUser() user: User,
  ): Promise<Movie> {
    return this.moviesService.create(input, user);
  }

  @Mutation(() => Movie)
  @UseGuards(GqlAuthGuard)
  async updateMovie(
    @Args('input') input: UpdateMovieInput,
    @CurrentUser() user: User,
  ): Promise<Movie> {
    return this.moviesService.update(input, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteMovie(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.moviesService.delete(id, user);
  }
}
