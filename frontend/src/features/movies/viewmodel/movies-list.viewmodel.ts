import { useState } from 'react'
import { toast } from 'react-toastify'
import { getGenresUseCase, getMoviesUseCase } from '../usecases'
import type { Genre, MovieConnection, MovieFilters } from '../model/movie.model'

export class MoviesListViewModel {
  async getMovies(
    filters?: MovieFilters,
    first: number = 10,
    after?: string,
  ): Promise<MovieConnection | null> {
    try {
      return await getMoviesUseCase.execute(filters, first, after)
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Erro ao carregar filmes')
      return null
    }
  }

  async getGenres(): Promise<Array<Genre>> {
    try {
      return await getGenresUseCase.execute()
    } catch (error) {
      console.error('Error fetching genres:', error)
      toast.error('Erro ao carregar gêneros')
      return []
    }
  }
}

export function useMoviesListViewModel() {
  const [movies, setMovies] = useState<MovieConnection | null>(null)
  const [genres, setGenres] = useState<Array<Genre>>([])
  const [filters, setFilters] = useState<MovieFilters>({})
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const viewModel = new MoviesListViewModel()

  const fetchMovies = async (
    newFilters?: MovieFilters,
    resetList = true,
  ): Promise<void> => {
    try {
      if (resetList) setLoading(true)
      else setLoadingMore(true)

      const filtersToUse = newFilters || filters
      const currentAfter = resetList ? undefined : movies?.pageInfo.endCursor

      const result = await viewModel.getMovies(filtersToUse, 10, currentAfter)

      if (result) {
        if (resetList) {
          setMovies(result)
        } else {
          setMovies({
            ...result,
            edges: [...(movies?.edges || []), ...result.edges],
          })
        }
      }
    } catch (error) {
      console.error('Error in fetchMovies:', error)
    } finally {
      if (resetList) setLoading(false)
      else setLoadingMore(false)
    }
  }

  const fetchGenres = async (): Promise<void> => {
    const result = await viewModel.getGenres()
    setGenres(result)
  }

  const handleFilterChange = (newFilters: MovieFilters) => {
    setFilters(newFilters)
    fetchMovies(newFilters)
  }

  const handleLoadMore = () => {
    if (movies?.pageInfo.hasNextPage && !loadingMore) {
      fetchMovies(filters, false)
    }
  }

  const initialize = async () => {
    setLoading(true)
    await Promise.all([fetchMovies(), fetchGenres()])
    setLoading(false)
  }

  return {
    movies,
    genres,
    loading,
    loadingMore,
    filters,
    initialize,
    handleFilterChange,
    handleLoadMore,
    refetch: () => fetchMovies(),
  }
}
