import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const [submitting, setSubmitting] = useState(false)
  const viewModel = new MovieFormViewModel()
  const queryClient = useQueryClient()

  // Fetch de gêneros usando React Query
  const { data: genres = [], isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: () => viewModel.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

  // Mutation para criar filme
  const createMovieMutation = useMutation({
    mutationFn: (input: CreateMovieInput) => viewModel.createMovie(input),
    onSuccess: () => {
      // Invalidar queries relacionadas a filmes quando um novo filme for criado
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateMovieFormData>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      description: '',
      status: MovieStatus.IN_PRODUCTION,
      language: '',
      trailerUrl: '',
      genreIds: [],
      imageUrl: '',
      backdropUrl: '',
    },
  })

  const onSubmit = async (data: CreateMovieFormData): Promise<boolean> => {
    setSubmitting(true)

    const input: CreateMovieInput = {
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      tagline: data.tagline || undefined,
      budget: data.budget,
      revenue: data.revenue,
      releaseDate: data.releaseDate || undefined,
      duration: data.duration,
      status: data.status,
      language: data.language || undefined,
      trailerUrl: data.trailerUrl || undefined,
      popularity: data.popularity,
      voteCount: data.voteCount,
      genreIds: data.genreIds || undefined,
      imageUrl: data.imageUrl || undefined,
      imageKey: data.imageKey || undefined,
      backdropUrl: data.backdropUrl || undefined,
      backdropKey: data.backdropKey || undefined,
      rating: data.rating,
    }

    try {
      const result = await createMovieMutation.mutateAsync(input)
      setSubmitting(false)

      if (result) {
        return true
      }

      return false
    } catch (error) {
      setSubmitting(false)
      return false
    }
  }

  const fetchGenres = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GENRES] })
  }, [queryClient])

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    genres,
    loading,
    isSubmitting: submitting || createMovieMutation.isPending,
    onSubmit,
    fetchGenres,
  }
}

export function useUpdateMovieViewModel(id: string) {
  const [submitting, setSubmitting] = useState(false)
  const viewModel = new MovieFormViewModel()
  const queryClient = useQueryClient()

  // Fetch do filme usando React Query
  const { data: movie, isLoading: loadingMovie } = useQuery({
    queryKey: [QUERY_KEYS.MOVIE(id)],
    queryFn: () => viewModel.getMovie(id),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

  // Fetch de gêneros usando React Query
  const { data: genres = [], isLoading: loadingGenres } = useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: () => viewModel.getGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  })

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
      }
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateMovieFormData>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      id,
      title: '',
      originalTitle: '',
      description: '',
      status: MovieStatus.IN_PRODUCTION,
      language: '',
      trailerUrl: '',
      genreIds: [],
      imageUrl: '',
      backdropUrl: '',
    },
  })

  // Atualizar o formulário quando os dados do filme estiverem disponíveis
  React.useEffect(() => {
    if (movie) {
      reset({
        id,
        title: movie.title,
        originalTitle: movie.originalTitle || '',
        description: movie.description || '',
        tagline: movie.tagline || '',
        budget: movie.budget,
        revenue: movie.revenue,
        releaseDate: movie.releaseDate
          ? new Date(movie.releaseDate).toISOString().split('T')[0]
          : undefined,
        duration: movie.duration,
        status: movie.status || MovieStatus.IN_PRODUCTION,
        language: movie.language || '',
        trailerUrl: movie.trailerUrl || '',
        popularity: movie.popularity,
        voteCount: movie.voteCount,
        genreIds: movie.genres.map((g) => g.id),
        imageUrl: movie.imageUrl || '',
        imageKey: movie.imageKey || '',
        backdropUrl: movie.backdropUrl || '',
        backdropKey: movie.backdropKey || '',
        rating: movie.rating,
      })
    }
  }, [id, movie, reset])

  const onSubmit = async (data: UpdateMovieFormData): Promise<boolean> => {
    setSubmitting(true)

    const input: UpdateMovieInput = {
      id,
      title: data.title,
      originalTitle: data.originalTitle || undefined,
      description: data.description || undefined,
      tagline: data.tagline || undefined,
      budget: data.budget,
      revenue: data.revenue,
      releaseDate: data.releaseDate
        ? new Date(data.releaseDate).toISOString()
        : undefined,
      duration: data.duration,
      status: data.status,
      language: data.language || undefined,
      trailerUrl: data.trailerUrl || undefined,
      popularity: data.popularity,
      voteCount: data.voteCount,
      genreIds: data.genreIds || undefined,
      imageUrl: data.imageUrl || undefined,
      imageKey: data.imageKey || undefined,
      backdropUrl: data.backdropUrl || undefined,
      backdropKey: data.backdropKey || undefined,
      rating: data.rating,
    }

    try {
      const result = await updateMovieMutation.mutateAsync(input)
      setSubmitting(false)

      if (result) {
        return true
      }

      return false
    } catch (error) {
      setSubmitting(false)
      return false
    }
  }

  // Manter fetchData para compatibilidade, embora o React Query já faça isso automaticamente
  const fetchData = useCallback(async (): Promise<void> => {
    // O React Query já está buscando os dados, então esta função é apenas um wrapper
    // mas mantemos para compatibilidade com o código existente
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIE(id)] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GENRES] }),
    ])
  }, [id, queryClient])

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    movie,
    genres,
    loading: loadingMovie || loadingGenres,
    isSubmitting: submitting || updateMovieMutation.isPending,
    onSubmit,
    fetchData,
  }
}
