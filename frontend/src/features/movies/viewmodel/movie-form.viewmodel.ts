import { gql, useMutation, useQuery } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import {
  CREATE_MOVIE,
  GET_GENRES,
  GET_MOVIE,
  UPDATE_MOVIE,
} from '../graphql/movies.graphql'
import { movieFormSchema } from '../schemas/movie.schema'
import type {
  CreateMovieInput,
  Genre,
  Movie,
  UpdateMovieInput,
} from '../model/movie.model'
import type {
  CreateMovieFormData,
  UpdateMovieFormData,
} from '../schemas/movie.schema'

export class MovieFormViewModel {
  setupForm(initialData?: Partial<Movie>) {
    // Importante: Converter os números para strings para o formulário
    return useForm<CreateMovieFormData>({
      resolver: zodResolver(movieFormSchema),
      defaultValues: {
        title: initialData?.title || '',
        originalTitle: initialData?.originalTitle || '',
        description: initialData?.description || '',
        budget: initialData?.budget,
        releaseDate: initialData?.releaseDate,

        duration: initialData?.duration,
        genreIds: initialData?.genres?.map((g) => g.id) || [],
        imageUrl: initialData?.imageUrl || '',
        backdropUrl: initialData?.backdropUrl || '',
        rating: initialData?.rating,
      },
    })
  }

  setupGenresQuery() {
    const { data, loading } = useQuery<{ genres: Array<Genre> }>(GET_GENRES)
    return {
      genres: data?.genres || [],
      loading,
    }
  }

  setupMovieQuery(id?: string) {
    const { data, loading } = useQuery<{ movie: Movie }, { id: string }>(
      GET_MOVIE,
      {
        variables: { id: id || '' },
        skip: !id,
      },
    )

    return {
      movie: data?.movie,
      loading,
    }
  }

  setupCreateMutation(navigate: ReturnType<typeof useNavigate>) {
    const [createMovie, { loading }] = useMutation<
      { createMovie: Movie },
      { input: CreateMovieInput }
    >(CREATE_MOVIE, {
      onCompleted: () => {
        toast.success('Filme criado com sucesso!')
        navigate({ to: '/' })
      },
      onError: (error) => {
        console.error('Erro ao criar filme:', error)
        toast.error('Erro ao criar filme. Tente novamente.')
      },
      update: (cache, { data }) => {
        if (data?.createMovie) {
          // Atualizar a cache para incluir o novo filme
          cache.modify({
            fields: {
              movies: (existingMovies = { edges: [] }) => {
                const newMovieRef = cache.writeFragment({
                  data: data.createMovie,
                  fragment: gql`
                    fragment NewMovie on Movie {
                      id
                    }
                  `,
                })
                return {
                  ...existingMovies,
                  edges: [
                    { cursor: data.createMovie.id, node: newMovieRef },
                    ...existingMovies.edges,
                  ],
                  totalCount: existingMovies.totalCount + 1,
                }
              },
            },
          })
        }
      },
    })

    return {
      createMovie,
      isCreating: loading,
    }
  }

  setupUpdateMutation(navigate: ReturnType<typeof useNavigate>) {
    const [updateMovie, { loading }] = useMutation<
      { updateMovie: Movie },
      { input: UpdateMovieInput }
    >(UPDATE_MOVIE, {
      onCompleted: () => {
        toast.success('Filme atualizado com sucesso!')
        navigate({ to: '/' })
      },
      onError: (error) => {
        console.error('Erro ao atualizar filme:', error)
        toast.error('Erro ao atualizar filme. Tente novamente.')
      },
    })

    return {
      updateMovie,
      isUpdating: loading,
    }
  }
}

export function useCreateMovieViewModel() {
  const navigate = useNavigate()
  const viewModel = new MovieFormViewModel()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = viewModel.setupForm()

  const { genres, loading: loadingGenres } = viewModel.setupGenresQuery()
  const { createMovie, isCreating } = viewModel.setupCreateMutation(navigate)

  const onSubmit = (data: CreateMovieFormData) => {
    const input: CreateMovieInput = {
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      budget: data.budget,
      releaseDate: data.releaseDate || undefined,
      duration: data.duration,
      genreIds: data.genreIds || undefined,
      imageUrl: data.imageUrl || undefined,
      backdropUrl: data.backdropUrl || undefined,
      rating: data.rating,
    }

    createMovie({ variables: { input } })
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    genres,
    loadingGenres,
    isSubmitting: isCreating,
    onSubmit,
  }
}

export function useUpdateMovieViewModel(id: string) {
  const navigate = useNavigate()
  const viewModel = new MovieFormViewModel()

  const { movie, loading: loadingMovie } = viewModel.setupMovieQuery(id)
  const { genres, loading: loadingGenres } = viewModel.setupGenresQuery()
  const { updateMovie, isUpdating } = viewModel.setupUpdateMutation(navigate)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = viewModel.setupForm(movie)

  const onSubmit = (data: UpdateMovieFormData) => {
    // Converter strings para números onde necessário
    const input: UpdateMovieInput = {
      id,
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      budget: data.budget,
      releaseDate: data.releaseDate || undefined,
      duration: data.duration,
      genreIds: data.genreIds || undefined,
      imageUrl: data.imageUrl || undefined,
      backdropUrl: data.backdropUrl || undefined,
      rating: data.rating,
    }

    updateMovie({ variables: { input } })
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    genres,
    movie,
    loadingMovie,
    loadingGenres,
    isSubmitting: isUpdating,
    onSubmit,
  }
}
