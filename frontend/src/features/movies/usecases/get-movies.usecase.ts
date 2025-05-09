import { moviesService } from '../services/movies.service'
import type { MovieConnection, MovieFilters } from '../model/movie.model'

export class GetMoviesUseCase {
  async execute(
    filters?: MovieFilters,
    first: number = 10,
    after?: string,
  ): Promise<MovieConnection> {
    return moviesService.getMovies(filters, first, after)
  }
}

export const getMoviesUseCase = new GetMoviesUseCase()
