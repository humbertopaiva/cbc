import { useState } from 'react'
import { toast } from 'react-toastify'
import { getGenresUseCase, getMoviesUseCase } from '../usecases'
import type { Genre, MovieConnection, MovieFilters } from '../model/movie.model'

export class MoviesListViewModel {
  async getMovies(
    filters?: MovieFilters,
    first: number = 10,
    after?: string,
    orderBy?: { field: string; direction: 'ASC' | 'DESC' },
  ): Promise<MovieConnection | null> {
    try {
      return await getMoviesUseCase.execute(filters, first, after, orderBy)
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
  const [orderBy, setOrderBy] = useState<{
    field: string
    direction: 'ASC' | 'DESC'
  }>({
    field: 'CREATED_AT',
    direction: 'DESC',
  })
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const viewModel = new MoviesListViewModel()

  const fetchMovies = async (
    newFilters?: MovieFilters,
    newOrderBy?: { field: string; direction: 'ASC' | 'DESC' },
    resetList = true,
  ): Promise<void> => {
    try {
      if (resetList) setLoading(true)
      else setLoadingMore(true)

      const filtersToUse = newFilters || filters
      const orderByToUse = newOrderBy || orderBy
      const currentAfter = resetList ? undefined : movies?.pageInfo.endCursor

      const result = await viewModel.getMovies(
        filtersToUse,
        10,
        currentAfter,
        orderByToUse,
      )

      if (result) {
        if (resetList) {
          setMovies(result)
        } else {
          setMovies({
            ...result,
            edges: [...(movies?.edges || []), ...result.edges],
            pageInfo: result.pageInfo,
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
    fetchMovies(newFilters, orderBy)
  }

  const handleOrderChange = (newOrderBy: {
    field: string
    direction: 'ASC' | 'DESC'
  }) => {
    setOrderBy(newOrderBy)
    fetchMovies(filters, newOrderBy)
  }

  const handleLoadMore = () => {
    if (movies?.pageInfo.hasNextPage && !loadingMore) {
      fetchMovies(filters, orderBy, false)
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
    orderBy,
    initialize,
    handleFilterChange,
    handleOrderChange,
    handleLoadMore,
    refetch: () => fetchMovies(),
  }
}
