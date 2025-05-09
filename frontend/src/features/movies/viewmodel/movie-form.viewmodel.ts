import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import {
  createMovieUseCase,
  getGenresUseCase,
  getMovieUseCase,
  updateMovieUseCase,
} from '../usecases'
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
  const [genres, setGenres] = useState<Array<Genre>>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const viewModel = new MovieFormViewModel()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateMovieFormData>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      description: '',
      genreIds: [],
      imageUrl: '',
      backdropUrl: '',
    },
  })

  const fetchGenres = async (): Promise<void> => {
    setLoading(true)
    const result = await viewModel.getGenres()
    setGenres(result)
    setLoading(false)
  }

  const onSubmit = async (data: CreateMovieFormData): Promise<void> => {
    setSubmitting(true)
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

    const result = await viewModel.createMovie(input)
    setSubmitting(false)

    if (result) {
      navigate({ to: '/' })
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    genres,
    loading,
    isSubmitting: submitting,
    onSubmit,
    fetchGenres,
  }
}

export function useUpdateMovieViewModel(id: string) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [genres, setGenres] = useState<Array<Genre>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const viewModel = new MovieFormViewModel()

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
      title: '',
      originalTitle: '',
      description: '',
      genreIds: [],
      imageUrl: '',
      backdropUrl: '',
    },
  })

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    const [movieData, genresData] = await Promise.all([
      viewModel.getMovie(id),
      viewModel.getGenres(),
    ])

    if (movieData) {
      setMovie(movieData)
      // Preencher o formulário com os dados do filme
      reset({
        title: movieData.title,
        originalTitle: movieData.originalTitle || '',
        description: movieData.description || '',
        budget: movieData.budget,
        releaseDate: movieData.releaseDate
          ? new Date(movieData.releaseDate).toISOString().split('T')[0]
          : undefined,
        duration: movieData.duration,
        genreIds: movieData.genres.map((g) => g.id),
        imageUrl: movieData.imageUrl || '',
        backdropUrl: movieData.backdropUrl || '',
        rating: movieData.rating,
      })
    }

    setGenres(genresData)
    setLoading(false)
  }

  const onSubmit = async (data: UpdateMovieFormData): Promise<void> => {
    setSubmitting(true)
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

    const result = await viewModel.updateMovie(input)
    setSubmitting(false)

    if (result) {
      navigate({ to: '/' })
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    movie,
    genres,
    loading,
    isSubmitting: submitting,
    onSubmit,
    fetchData,
  }
}
