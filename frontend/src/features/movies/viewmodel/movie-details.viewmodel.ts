import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { deleteMovieUseCase, getMovieUseCase } from '../usecases'
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
      return await deleteMovieUseCase.execute(id)
    } catch (error) {
      console.error('Error deleting movie:', error)
      toast.error('Erro ao excluir o filme')
      return false
    }
  }
}

export function useMovieDetailsViewModel(id: string) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const viewModel = new MovieDetailsViewModel()

  const fetchMovie = async (): Promise<void> => {
    setLoading(true)
    const result = await viewModel.getMovie(id)
    setMovie(result)
    setLoading(false)
  }

  const handleDelete = async (): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      setIsDeleting(true)
      const success = await viewModel.deleteMovie(id)
      setIsDeleting(false)

      if (success) {
        toast.success('Filme excluído com sucesso!')
        navigate({ to: '/' })
      }
    }
  }

  return {
    movie,
    loading,
    isDeleting,
    fetchMovie,
    handleDelete,
  }
}
