import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMovieUseCase,
  getGenresUseCase,
  getMovieUseCase,
  updateMovieUseCase,
} from '../usecases'
import { movieFormSchema } from '../schemas/movie.schema'
import { MovieStatus } from '../model/movie.model'
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
import { useFormViewModel } from '@/core/hooks/useFormViewModel'

// Chaves de cache para React Query
export const QUERY_KEYS = {
  MOVIES: 'movies',
  MOVIE: (id: string) => ['movie', id],
  GENRES: 'genres',
}

export class MovieFormViewModel {
  async getMovie(id: string): Promise<Movie | null> {
    try {
      return await getMovieUseCase.execute(id)
    } catch (error) {
      console.error('Error fetching movie:', error)
      toast.error('Erro ao carregar dados do filme')
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

  async createMovie(input: CreateMovieInput): Promise<Movie | null> {
    try {
      // Calcular o lucro se orçamento e receita estiverem disponíveis
      if (input.budget !== undefined && input.revenue !== undefined) {
        input.profit = input.revenue - input.budget
      }

      const result = await createMovieUseCase.execute(input)
      toast.success('Filme criado com sucesso!')
      return result
    } catch (error) {
      console.error('Error creating movie:', error)
      toast.error('Erro ao criar filme')
      return null
    }
  }

  async updateMovie(input: UpdateMovieInput): Promise<Movie | null> {
    try {
      // Calcular o lucro se orçamento e receita estiverem disponíveis
      if (input.budget !== undefined && input.revenue !== undefined) {
        input.profit = input.revenue - input.budget
      }

      const result = await updateMovieUseCase.execute(input)
      toast.success('Filme atualizado com sucesso!')
      return result
    } catch (error) {
      console.error('Error updating movie:', error)
      toast.error('Erro ao atualizar filme')
      return null
    }
  }
}

export function useCreateMovieViewModel() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [genres, setGenres] = useState<Array<Genre>>([])
  const viewModel = new MovieFormViewModel()

  // Fetch de gêneros usando React Query
  const {
    data: genresData,
    isLoading: loading,
    refetch: refetchGenres,
  } = useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: () => viewModel.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

  // Atualizar o estado quando os dados de gêneros mudarem
  useEffect(() => {
    if (genresData) {
      setGenres(genresData)
    }
  }, [genresData])

  // Mutation para criar filme
  const createMovieMutation = useMutation({
    mutationFn: (input: CreateMovieInput) => viewModel.createMovie(input),
    onSuccess: () => {
      // Invalidar queries relacionadas a filmes quando um novo filme for criado
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] })
      navigate({ to: '/' })
    },
  })

  const defaultValues: CreateMovieFormData = {
    title: '',
    originalTitle: '',
    description: '',
    tagline: '',
    budget: undefined,
    revenue: undefined,
    releaseDate: '',
    duration: undefined,
    status: MovieStatus.IN_PRODUCTION,
    language: '',
    trailerUrl: '',
    popularity: undefined,
    voteCount: undefined,
    genreIds: [],
    imageUrl: '',
    imageKey: '',
    backdropUrl: '',
    backdropKey: '',
    rating: undefined,
  }

  const onSubmitHandler = async (data: CreateMovieFormData) => {
    const input: CreateMovieInput = {
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      tagline: data.tagline || undefined,
      budget: data.budget ? data.budget : undefined,
      revenue: data.revenue ? data.revenue : undefined,
      releaseDate: data.releaseDate || undefined,
      duration: data.duration ? data.duration : undefined,
      status: data.status,
      language: data.language || undefined,
      trailerUrl: data.trailerUrl || undefined,
      popularity: data.popularity ? data.popularity : undefined,
      voteCount: data.voteCount ? data.voteCount : undefined,
      genreIds: data.genreIds?.length ? data.genreIds : undefined,
      imageUrl: data.imageUrl || undefined,
      imageKey: data.imageKey || undefined,
      backdropUrl: data.backdropUrl || undefined,
      backdropKey: data.backdropKey || undefined,
      rating: data.rating ? data.rating : undefined,
    }

    await createMovieMutation.mutateAsync(input)
  }

  // Usando a forma adequada para extrair os valores do useFormViewModel
  const formViewModel = useFormViewModel({
    schema: movieFormSchema,
    defaultValues,
    onSubmitHandler,
  })

  const {
    register,
    handleSubmit,
    errors,
    reset,
    isLoading: formLoading,
    setValue,
    watch,
  } = formViewModel

  const fetchGenres = useCallback(async (): Promise<void> => {
    await refetchGenres()
  }, [refetchGenres])

  // Mantendo a assinatura original da função onSubmit para compatibilidade
  const onSubmit = async (data: CreateMovieFormData): Promise<boolean> => {
    try {
      await onSubmitHandler(data)
      return true
    } catch (error) {
      return false
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    genres,
    loading: loading || formLoading,
    isSubmitting: createMovieMutation.isPending,
    onSubmit,
    fetchGenres,
  }
}

export function useUpdateMovieViewModel(id: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [genres, setGenres] = useState<Array<Genre>>([])
  const viewModel = new MovieFormViewModel()

  // Fetch do filme usando React Query
  const {
    data: movieData,
    isLoading: loadingMovie,
    refetch: refetchMovie,
  } = useQuery({
    queryKey: [QUERY_KEYS.MOVIE(id)],
    queryFn: () => viewModel.getMovie(id),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

  // Atualizar o estado quando os dados do filme mudarem
  useEffect(() => {
    if (movieData) {
      setMovie(movieData)
    }
  }, [movieData])

  // Fetch de gêneros usando React Query
  const {
    data: genresData,
    isLoading: loadingGenres,
    refetch: refetchGenres,
  } = useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: () => viewModel.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

  // Atualizar o estado quando os dados de gêneros mudarem
  useEffect(() => {
    if (genresData) {
      setGenres(genresData)
    }
  }, [genresData])

  // Mutation para atualizar filme
  const updateMovieMutation = useMutation({
    mutationFn: (input: UpdateMovieInput) => viewModel.updateMovie(input),
    onSuccess: (updatedMovie) => {
      // Invalidar queries relacionadas a filmes quando um filme for atualizado
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] })
      if (updatedMovie) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MOVIE(updatedMovie.id)],
        })
        navigate({ to: `/movies/${id}` })
      }
    },
  })

  const defaultValues: UpdateMovieFormData = {
    id,
    title: '',
    originalTitle: '',
    description: '',
    tagline: '',
    budget: undefined,
    revenue: undefined,
    releaseDate: '',
    duration: undefined,
    status: MovieStatus.IN_PRODUCTION,
    language: '',
    trailerUrl: '',
    popularity: undefined,
    voteCount: undefined,
    genreIds: [],
    imageUrl: '',
    imageKey: '',
    backdropUrl: '',
    backdropKey: '',
    rating: undefined,
  }

  const onSubmitHandler = async (data: UpdateMovieFormData) => {
    const input: UpdateMovieInput = {
      id,
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      tagline: data.tagline || undefined,
      budget: data.budget ? data.budget : undefined,
      revenue: data.revenue ? data.revenue : undefined,
      releaseDate: data.releaseDate
        ? new Date(data.releaseDate).toISOString()
        : undefined,
      duration: data.duration ? data.duration : undefined,
      status: data.status,
      language: data.language || undefined,
      trailerUrl: data.trailerUrl || undefined,
      popularity: data.popularity ? data.popularity : undefined,
      voteCount: data.voteCount ? data.voteCount : undefined,
      genreIds: data.genreIds?.length ? data.genreIds : undefined,
      imageUrl: data.imageUrl || undefined,
      imageKey: data.imageKey || undefined,
      backdropUrl: data.backdropUrl || undefined,
      backdropKey: data.backdropKey || undefined,
      rating: data.rating ? data.rating : undefined,
    }

    await updateMovieMutation.mutateAsync(input)
  }

  // Usando a forma adequada para extrair os valores do useFormViewModel
  const formViewModel = useFormViewModel({
    schema: movieFormSchema,
    defaultValues,
    onSubmitHandler,
  })

  const {
    register,
    handleSubmit,
    errors,
    reset,
    isLoading: formLoading,
    setValue,
    watch,
  } = formViewModel

  // Atualizar o formulário quando os dados do filme estiverem disponíveis
  useEffect(() => {
    if (movie) {
      reset({
        id,
        title: movie.title,
        originalTitle: movie.originalTitle || '',
        description: movie.description || '',
        tagline: movie.tagline || '',
        // Para campos numéricos, use undefined em vez de string vazia se o valor não existir
        budget:
          movie.budget !== undefined
            ? parseFloat(String(movie.budget))
            : undefined,
        revenue:
          movie.revenue !== undefined
            ? parseFloat(String(movie.revenue))
            : undefined,
        releaseDate: movie.releaseDate
          ? new Date(movie.releaseDate).toISOString().split('T')[0]
          : '',
        duration:
          movie.duration !== undefined
            ? parseInt(String(movie.duration))
            : undefined,
        status: movie.status || MovieStatus.IN_PRODUCTION,
        language: movie.language || '',
        trailerUrl: movie.trailerUrl || '',
        popularity:
          movie.popularity !== undefined
            ? parseInt(String(movie.popularity))
            : undefined,
        voteCount:
          movie.voteCount !== undefined
            ? parseInt(String(movie.voteCount))
            : undefined,
        genreIds: movie.genres.map((g) => g.id),
        imageUrl: movie.imageUrl || '',
        imageKey: movie.imageKey || '',
        backdropUrl: movie.backdropUrl || '',
        backdropKey: movie.backdropKey || '',
        rating:
          movie.rating !== undefined
            ? parseFloat(String(movie.rating))
            : undefined,
      })
    }
  }, [id, movie, reset])

  // Manter fetchData para compatibilidade
  const fetchData = useCallback(async (): Promise<void> => {
    await Promise.all([refetchMovie(), refetchGenres()])
  }, [refetchMovie, refetchGenres])

  // Mantendo a assinatura original da função onSubmit para compatibilidade
  const onSubmit = async (data: UpdateMovieFormData): Promise<boolean> => {
    try {
      await onSubmitHandler(data)
      return true
    } catch (error) {
      return false
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    movie,
    genres,
    loading: loadingMovie || loadingGenres || formLoading,
    isSubmitting: updateMovieMutation.isPending,
    onSubmit,
    fetchData,
  }
}
