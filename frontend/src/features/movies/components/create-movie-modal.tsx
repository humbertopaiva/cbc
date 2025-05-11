import React, { useEffect, useState } from 'react'
import {
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiFilm,
  FiImage,
  FiInfo,
  FiSave,
  FiTag,
} from 'react-icons/fi'
import { GenreSelect } from './genre-select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useCreateMovieViewModel } from '@/features/movies/viewmodel/movie-form.viewmodel'
import { ImageUpload } from '@/features/movies/components/image-upload'
import { MovieStatus } from '@/features/movies/model/movie.model'

interface CreateMovieModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const CreateMovieModal: React.FC<CreateMovieModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    genres,
    loading,
    isSubmitting,
    onSubmit: formSubmit,
    fetchGenres,
  } = useCreateMovieViewModel()

  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    if (open) {
      fetchGenres()
    }
  }, [open, fetchGenres])

  // Resetar form quando fechar o modal
  useEffect(() => {
    if (!open) {
      reset()
      setActiveTab('basic')
    }
  }, [open, reset])

  const onSubmit = async (data: any) => {
    const success = await formSubmit(data)
    if (success && onSuccess) {
      onSuccess()
      onClose()
    }
  }

  const handleGenresChange = (selectedIds: Array<string>) => {
    setValue('genreIds', selectedIds, { shouldValidate: true })
  }

  // Footer com botões de ação
  const modalFooter = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button
        type="submit"
        form="create-movie-form"
        className="flex items-center gap-2"
        disabled={isSubmitting}
      >
        <FiSave className="w-4 h-4" />
        {isSubmitting ? 'Salvando...' : 'Adicionar Filme'}
      </Button>
    </div>
  )

  // Conteúdo das abas
  const tabContent = {
    basic: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Título do filme"
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="originalTitle"
              className="block text-sm font-medium mb-1"
            >
              Título Original
            </label>
            <input
              id="originalTitle"
              type="text"
              {...register('originalTitle')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Título original (se diferente)"
            />
            {errors.originalTitle && (
              <p className="text-destructive text-sm mt-1">
                {errors.originalTitle.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium mb-1">
              Frase de Efeito
            </label>
            <input
              id="tagline"
              type="text"
              {...register('tagline')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Frase de efeito do filme (ex: 'Todo herói tem um começo')"
            />
            {errors.tagline && (
              <p className="text-destructive text-sm mt-1">
                {errors.tagline.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Descrição
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="w-full p-2 border rounded-md bg-background h-32"
              placeholder="Descrição do filme"
            />
            {errors.description && (
              <p className="text-destructive text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>
    ),
    details: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Detalhes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Situação
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="">Selecione a situação</option>
              <option value={MovieStatus.RELEASED}>Lançado</option>
              <option value={MovieStatus.IN_PRODUCTION}>Em Produção</option>
            </select>
            {errors.status && (
              <p className="text-destructive text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium mb-1"
            >
              Idioma
            </label>
            <input
              id="language"
              type="text"
              {...register('language')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Idioma principal do filme"
            />
            {errors.language && (
              <p className="text-destructive text-sm mt-1">
                {errors.language.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium mb-1"
            >
              Data de Lançamento
            </label>
            <input
              id="releaseDate"
              type="date"
              {...register('releaseDate')}
              className="w-full p-2 border rounded-md bg-background"
            />
            {errors.releaseDate && (
              <p className="text-destructive text-sm mt-1">
                {errors.releaseDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium mb-1"
            >
              Duração (minutos)
            </label>
            <input
              id="duration"
              type="number"
              {...register('duration')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Duração em minutos"
              min="1"
            />
            {errors.duration && (
              <p className="text-destructive text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="trailerUrl"
              className="block text-sm font-medium mb-1"
            >
              URL do Trailer
            </label>
            <input
              id="trailerUrl"
              type="url"
              {...register('trailerUrl')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="URL do trailer no YouTube"
            />
            {errors.trailerUrl && (
              <p className="text-destructive text-sm mt-1">
                {errors.trailerUrl.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <GenreSelect
            genres={genres}
            selectedGenres={watch('genreIds') || []}
            onChange={handleGenresChange}
            error={errors.genreIds?.message}
          />
        </div>
      </div>
    ),
    financial: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Informações Financeiras</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-1">
              Orçamento (USD)
            </label>
            <input
              id="budget"
              type="number"
              {...register('budget')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Orçamento em dólares"
              min="0"
              step="0.01"
            />
            {errors.budget && (
              <p className="text-destructive text-sm mt-1">
                {errors.budget.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="revenue" className="block text-sm font-medium mb-1">
              Receita (USD)
            </label>
            <input
              id="revenue"
              type="number"
              {...register('revenue')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Receita em dólares"
              min="0"
              step="0.01"
            />
            {errors.revenue && (
              <p className="text-destructive text-sm mt-1">
                {errors.revenue.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="popularity"
              className="block text-sm font-medium mb-1"
            >
              Popularidade
            </label>
            <input
              id="popularity"
              type="number"
              {...register('popularity')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Nível de popularidade"
              min="0"
            />
            {errors.popularity && (
              <p className="text-destructive text-sm mt-1">
                {errors.popularity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="voteCount"
              className="block text-sm font-medium mb-1"
            >
              Contagem de Votos
            </label>
            <input
              id="voteCount"
              type="number"
              {...register('voteCount')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Número total de votos"
              min="0"
            />
            {errors.voteCount && (
              <p className="text-destructive text-sm mt-1">
                {errors.voteCount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Nota (0-10)
            </label>
            <input
              id="rating"
              type="number"
              {...register('rating')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Avaliação de 0 a 10"
              min="0"
              max="10"
              step="0.1"
            />
            {errors.rating && (
              <p className="text-destructive text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>
        </div>
      </div>
    ),
    images: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3">Imagens</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUpload
              imageUrl={watch('imageUrl')}
              imageKey={watch('imageKey')}
              onImageChange={(url, key) => {
                setValue('imageUrl', url)
                setValue('imageKey', key)
              }}
              label="Imagem de Capa"
              folder="posters"
            />
            {errors.imageUrl && (
              <p className="text-destructive text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div>
            <ImageUpload
              imageUrl={watch('backdropUrl')}
              imageKey={watch('backdropKey')}
              onImageChange={(url, key) => {
                setValue('backdropUrl', url)
                setValue('backdropKey', key)
              }}
              label="Imagem de Fundo (Backdrop)"
              folder="backdrops"
            />
            {errors.backdropUrl && (
              <p className="text-destructive text-sm mt-1">
                {errors.backdropUrl.message}
              </p>
            )}
          </div>
        </div>
      </div>
    ),
  }

  return (
    <Modal
      title="Adicionar Novo Filme"
      open={open}
      onClose={onClose}
      footer={modalFooter}
      maxWidth="2xl"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          <p className="ml-3">Carregando...</p>
        </div>
      ) : (
        <div>
          {/* Navegação por abas */}
          <div className="border-b mb-6">
            <div className="flex flex-wrap -mb-px overflow-x-auto no-scrollbar">
              <button
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'basic'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
                onClick={() => setActiveTab('basic')}
                type="button"
              >
                <FiBookOpen className="mr-2 h-4 w-4" />
                Básico
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
                onClick={() => setActiveTab('details')}
                type="button"
              >
                <FiInfo className="mr-2 h-4 w-4" />
                Detalhes
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'financial'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
                onClick={() => setActiveTab('financial')}
                type="button"
              >
                <FiDollarSign className="mr-2 h-4 w-4" />
                Financeiro
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'images'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
                onClick={() => setActiveTab('images')}
                type="button"
              >
                <FiImage className="mr-2 h-4 w-4" />
                Imagens
              </button>
            </div>
          </div>

          <form id="create-movie-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Conteúdo da aba ativa */}
            {tabContent[activeTab as keyof typeof tabContent]}

            {/* Navegação entre abas */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              {activeTab !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ['basic', 'details', 'financial', 'images']
                    const currentIndex = tabs.indexOf(activeTab)
                    setActiveTab(tabs[currentIndex - 1])
                  }}
                >
                  Anterior
                </Button>
              )}

              {activeTab !== 'images' && (
                <Button
                  type="button"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => {
                    const tabs = ['basic', 'details', 'financial', 'images']
                    const currentIndex = tabs.indexOf(activeTab)
                    setActiveTab(tabs[currentIndex + 1])
                  }}
                >
                  Próximo
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </Modal>
  )
}
