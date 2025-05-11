import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMovieUseCase, getMovieUseCase } from '../usecases'
import { QUERY_KEYS } from './movie-form.viewmodel'
import type { Movie } from '../model/movie.model'

export class MovieDetailsViewModel {
  async getMovie(id: string): Promise<Movie | null> {
    try {
      return await getMovieUseCase.execute(id)
    } catch (error) {
      console.error('Error fetching movie:', error)
      toast.error('Erro ao carregar detalhes do filme')
      return null
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
      toast.error('Erro ao excluir o filme')
      return false
    }
  }
}

export function useMovieDetailsViewModel(id: string) {
  const navigate = useNavigate()
  const viewModel = new MovieDetailsViewModel()
  const queryClient = useQueryClient()

  // Buscar filme com React Query
  const {
    data: movie,
    isLoading: loading,
    refetch: fetchMovie,
  } = useQuery({
    queryKey: [QUERY_KEYS.MOVIE(id)],
    queryFn: () => viewModel.getMovie(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Mutation para excluir filme
  const deleteMutation = useMutation({
    mutationFn: (movieId: string) => viewModel.deleteMovie(movieId),
    onSuccess: () => {
      // Invalidar queries relacionadas a filmes quando um filme for excluído
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] })
      // Navegar para a página inicial
      navigate({ to: '/' })
    },
  })

  const handleDelete = async (): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return {
    movie,
    loading,
    isDeleting: deleteMutation.isPending,
    fetchMovie,
    handleDelete,
  }
}
