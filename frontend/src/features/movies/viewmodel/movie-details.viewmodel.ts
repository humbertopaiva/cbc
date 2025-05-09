import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { DELETE_MOVIE, GET_MOVIE } from '../graphql/movies.graphql'
import type { Movie } from '../model/movie.model'

export class MovieDetailsViewModel {
  setupMovieQuery(id: string) {
    const { data, loading, error } = useQuery<{ movie: Movie }, { id: string }>(
      GET_MOVIE,
      {
        variables: { id },
        fetchPolicy: 'cache-and-network',
      },
    )

    return {
      movie: data?.movie,
      loading,
      error,
    }
  }

  setupDeleteMutation(navigate: ReturnType<typeof useNavigate>) {
    const [deleteMovie, { loading }] = useMutation<
      { deleteMovie: boolean },
      { id: string }
    >(DELETE_MOVIE, {
      onCompleted: () => {
        toast.success('Filme excluído com sucesso!')
        navigate({ to: '/' })
      },
      onError: (error) => {
        console.error('Erro ao excluir filme:', error)
        toast.error('Erro ao excluir filme. Tente novamente.')
      },
      update: (cache, { data }) => {
        if (data?.deleteMovie) {
          cache.modify({
            fields: {
              movies: (existingMovies = {}, { readField }) => {
                return {
                  ...existingMovies,
                  edges: existingMovies.edges.filter(
                    (edge: any) => readField('id', edge.node) !== id,
                  ),
                }
              },
            },
          })
        }
      },
    })

    return {
      deleteMovie,
      isDeleting: loading,
    }
  }
}

export function useMovieDetailsViewModel(id: string) {
  const navigate = useNavigate()
  const viewModel = new MovieDetailsViewModel()

  const { movie, loading, error } = viewModel.setupMovieQuery(id)
  const { deleteMovie, isDeleting } = viewModel.setupDeleteMutation(navigate)

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      deleteMovie({ variables: { id } })
    }
  }

  return {
    movie,
    loading,
    error,
    isDeleting,
    handleDelete,
  }
}
