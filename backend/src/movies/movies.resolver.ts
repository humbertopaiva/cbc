import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { NotificationService } from './notification.service';
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
  constructor(
    private readonly moviesService: MoviesService,
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => Movie)
  @UseGuards(GqlAuthGuard)
  async movie(@Args('id', { type: () => ID }) id: string): Promise<Movie> {
    return this.moviesService.findById(id);
  }

  @Query(() => MovieConnection)
  @UseGuards(GqlAuthGuard)
  async movies(
    @Args('filters', { nullable: true }) filters?: MovieFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: MoviesPaginationInput,
  ): Promise<MovieConnection> {
    return this.moviesService.findAll(filters, pagination);
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

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async testMovieNotification(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const movie = await this.moviesService.findById(id);

    // Verificar se o usuário é o criador do filme
    if (movie.createdBy.id !== user.id) {
      throw new ForbiddenException('You are not authorized to test notifications for this movie');
    }

    return this.notificationService.forceNotificationsForTestingPurposes(id);
  }
}
