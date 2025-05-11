import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteMovieUseCase,
  getGenresUseCase,
  getMoviesUseCase,
} from '../usecases'
import { QUERY_KEYS } from './movie-form.viewmodel'
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

  async deleteMovie(id: string): Promise<boolean> {
    try {
      const result = await deleteMovieUseCase.execute(id)
      if (result) {
        toast.success('Filme excluído com sucesso!')
      }
      return result
    } catch (error) {
      console.error('Error deleting movie:', error)
      toast.error('Erro ao excluir filme')
      return false
    }
  }
}

export function useMoviesListViewModel() {
  const [filters, setFilters] = useState<MovieFilters>({})
  const [orderBy, setOrderBy] = useState<{
    field: string
    direction: 'ASC' | 'DESC'
  }>({
    field: 'CREATED_AT',
    direction: 'DESC',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [cursorMap, setCursorMap] = useState<Record<number, string>>({})
  const pageSize = 10
  const viewModel = new MoviesListViewModel()
  const queryClient = useQueryClient()

  // Construir a chave da query com base nos filtros e paginação
  const getQueryKey = useCallback(
    (page: number = currentPage) => {
      const after = page > 1 ? cursorMap[page - 1] : undefined
      return [
        QUERY_KEYS.MOVIES,
        {
          filters,
          orderBy,
          pagination: {
            pageSize,
            after,
          },
        },
      ]
    },
    [filters, orderBy, currentPage, cursorMap, pageSize],
  )

  // Buscar filmes com React Query
  const {
    data: movies,
    isLoading: loadingMovies,
    refetch: refetchMovies,
  } = useQuery({
    queryKey: getQueryKey(),
    queryFn: () =>
      viewModel.getMovies(filters, {
        pageSize,
        after: currentPage > 1 ? cursorMap[currentPage - 1] : undefined,
        orderBy,
      }),
    staleTime: 60 * 1000, // 1 minuto
  })

  // Buscar gêneros com React Query
  const { data: genres = [], isLoading: loadingGenres } = useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: () => viewModel.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Mutation para excluir filme
  const deleteMutation = useMutation({
    mutationFn: (id: string) => viewModel.deleteMovie(id),
    onSuccess: () => {
      // Invalidar queries relacionadas a filmes quando um filme for excluído
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] })
    },
  })

  // Atualizar o mapa de cursores quando os dados dos filmes forem carregados
  useEffect(() => {
    if (movies && movies.edges.length > 0 && movies.pageInfo.hasNextPage) {
      setCursorMap((prev) => ({
        ...prev,
        [currentPage]:
          movies.pageInfo.endCursor ||
          movies.edges[movies.edges.length - 1].cursor,
      }))
    }
  }, [movies, currentPage])

  const handleFilterChange = (newFilters: MovieFilters) => {
    setFilters(newFilters)
    setCursorMap({}) // Resetar cursores quando mudam os filtros
    setCurrentPage(1) // Voltar para a primeira página

    // Não é necessário chamar refetch explicitamente aqui,
    // pois a mudança em filters causa a reexecução da query
  }

  const handleOrderChange = (newOrderBy: {
    field: string
    direction: 'ASC' | 'DESC'
  }) => {
    setOrderBy(newOrderBy)
    setCursorMap({}) // Resetar cursores quando muda a ordenação
    setCurrentPage(1) // Voltar para a primeira página

    // Não é necessário chamar refetch explicitamente aqui,
    // pois a mudança em orderBy causa a reexecução da query
  }

  const handlePageChange = (page: number) => {
    if (page < 1) return

    if (
      page > 1 &&
      !cursorMap[page - 1] &&
      page > Object.keys(cursorMap).length + 1
    ) {
      // Por enquanto, simplesmente voltar para a página 1 se tentarmos pular muitas páginas
      setCurrentPage(1)
      return
    }

    setCurrentPage(page)
  }

  const calculateTotalPages = (): number => {
    if (!movies) return 1
    return Math.ceil(movies.totalCount / pageSize)
  }

  const deleteMovie = async (id: string): Promise<boolean> => {
    return await deleteMutation.mutateAsync(id)
  }

  const initialize = useCallback(() => {
    // A inicialização já é feita automaticamente pelo React Query
    // Esta função é mantida para compatibilidade com o código existente
  }, [])

  return {
    movies,
    genres,
    loading: loadingMovies || loadingGenres || deleteMutation.isPending,
    filters,
    orderBy,
    currentPage,
    totalPages: calculateTotalPages(),
    pageSize,
    initialize,
    handleFilterChange,
    handleOrderChange,
    handlePageChange,
    deleteMovie,
    refetch: refetchMovies,
  }
}
