import { useState } from 'react'
import { toast } from 'react-toastify'
import { getGenresUseCase, getMoviesUseCase } from '../usecases'
import type { Genre, MovieConnection, MovieFilters } from '../model/movie.model'

export class MoviesListViewModel {
  async getMovies(
    filters?: MovieFilters,
    pagination?: {
      page?: number
      pageSize?: number
      after?: string
      orderBy?: { field: string; direction: 'ASC' | 'DESC' }
    },
  ): Promise<MovieConnection | null> {
    try {
      return await getMoviesUseCase.execute(filters, pagination)
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
  const [currentPage, setCurrentPage] = useState(1)
  const [cursorMap, setCursorMap] = useState<Record<number, string>>({})
  const pageSize = 10
  const viewModel = new MoviesListViewModel()

  const fetchMovies = async (
    newFilters?: MovieFilters,
    newOrderBy?: { field: string; direction: 'ASC' | 'DESC' },
    pageToFetch: number = 1,
  ): Promise<void> => {
    try {
      setLoading(true)

      const filtersToUse = newFilters || filters
      const orderByToUse = newOrderBy || orderBy

      // Se estiver na primeira página, não usar cursor
      // Se estiver em páginas posteriores, usar o cursor mapeado
      const after = pageToFetch > 1 ? cursorMap[pageToFetch - 1] : undefined

      const result = await viewModel.getMovies(filtersToUse, {
        pageSize,
        after,
        orderBy: orderByToUse,
      })

      if (result) {
        setMovies(result)

        // Armazenar o cursor para a próxima página
        if (result.edges.length > 0 && result.pageInfo.hasNextPage) {
          setCursorMap((prev) => ({
            ...prev,
            [pageToFetch]:
              result.pageInfo.endCursor ||
              result.edges[result.edges.length - 1].cursor,
          }))
        }

        setCurrentPage(pageToFetch)
      }
    } catch (error) {
      console.error('Error in fetchMovies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async (): Promise<void> => {
    const result = await viewModel.getGenres()
    setGenres(result)
  }

  const handleFilterChange = (newFilters: MovieFilters) => {
    setFilters(newFilters)
    setCursorMap({}) // Resetar cursores quando mudam os filtros
    fetchMovies(newFilters, orderBy, 1)
  }

  const handleOrderChange = (newOrderBy: {
    field: string
    direction: 'ASC' | 'DESC'
  }) => {
    setOrderBy(newOrderBy)
    setCursorMap({}) // Resetar cursores quando muda a ordenação
    fetchMovies(filters, newOrderBy, 1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1) return

    // Se estamos tentando ir para uma página que ainda não temos cursor
    // e não é a primeira página, precisamos construir os cursores intermediários
    if (
      page > 1 &&
      !cursorMap[page - 1] &&
      page > Object.keys(cursorMap).length + 1
    ) {
      // Por enquanto, simplesmente voltar para a página 1 se tentarmos pular muitas páginas
      fetchMovies(filters, orderBy, 1)
      return
    }

    fetchMovies(filters, orderBy, page)
  }

  const calculateTotalPages = (): number => {
    if (!movies) return 1
    return Math.ceil(movies.totalCount / pageSize)
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
    filters,
    orderBy,
    currentPage,
    totalPages: calculateTotalPages(),
    pageSize,
    initialize,
    handleFilterChange,
    handleOrderChange,
    handlePageChange,
    refetch: () => fetchMovies(),
  }
}
