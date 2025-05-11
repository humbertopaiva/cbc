import React, { useEffect } from 'react'
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiGlobe,
  FiSave,
  FiStar,
  FiTag,
  FiType,
  FiYoutube,
} from 'react-icons/fi'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
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

  useEffect(() => {
    if (open) {
      fetchGenres()
    }
  }, [open, fetchGenres])

  // Resetar form quando fechar o modal
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: any) => {
    const success = await formSubmit(data)
    if (success && onSuccess) {
      onSuccess()
      onClose()
    }
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
        variant="primary"
      >
        <FiSave className="w-4 h-4" />
        {isSubmitting ? 'Salvando...' : 'Adicionar Filme'}
      </Button>
    </div>
  )

  return (
    <Modal
      title="Adicionar Filme"
      open={open}
      onClose={onClose}
      footer={modalFooter}
      maxWidth="2xl"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      ) : (
        <form
          id="create-movie-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  {...register('title')}
                  placeholder="Título do filme"
                  icon={<FiType />}
                  value={watch('title') || ''}
                  showClearButton={!!watch('title')}
                  onClear={() => setValue('title', '')}
                />
                {errors.title && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="originalTitle"
                  className="block text-sm font-medium mb-1"
                >
                  Título Original
                </label>
                <Input
                  id="originalTitle"
                  type="text"
                  {...register('originalTitle')}
                  placeholder="Título original (se diferente)"
                  icon={<FiType />}
                  value={watch('originalTitle') || ''}
                  showClearButton={!!watch('originalTitle')}
                  onClear={() => setValue('originalTitle', '')}
                />
                {errors.originalTitle && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.originalTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tagline"
                  className="block text-sm font-medium mb-1"
                >
                  Frase de Efeito
                </label>
                <Input
                  id="tagline"
                  type="text"
                  {...register('tagline')}
                  placeholder="Frase de efeito do filme"
                  icon={<FiTag />}
                  value={watch('tagline') || ''}
                  showClearButton={!!watch('tagline')}
                  onClear={() => setValue('tagline', '')}
                />
                {errors.tagline && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.tagline.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Situação
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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

              <div className="space-y-2">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium mb-1"
                >
                  Idioma
                </label>
                <Input
                  id="language"
                  type="text"
                  {...register('language')}
                  placeholder="Idioma principal do filme"
                  icon={<FiGlobe />}
                  value={watch('language') || ''}
                  showClearButton={!!watch('language')}
                  onClear={() => setValue('language', '')}
                />
                {errors.language && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="releaseDate"
                  className="block text-sm font-medium mb-1"
                >
                  Data de Lançamento
                </label>
                <Input
                  id="releaseDate"
                  type="date"
                  {...register('releaseDate')}
                  icon={<FiCalendar />}
                  value={watch('releaseDate') || ''}
                  showClearButton={!!watch('releaseDate')}
                  onClear={() => setValue('releaseDate', '')}
                />
                {errors.releaseDate && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.releaseDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium mb-1"
                >
                  Duração (minutos)
                </label>
                <Input
                  id="duration"
                  type="number"
                  {...register('duration')}
                  placeholder="Duração em minutos"
                  min="1"
                  icon={<FiClock />}
                  value={watch('duration') || ''}
                  showClearButton={!!watch('duration')}
                  onClear={() => setValue('duration', undefined)}
                />
                {errors.duration && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="trailerUrl"
                  className="block text-sm font-medium mb-1"
                >
                  URL do Trailer
                </label>
                <Input
                  id="trailerUrl"
                  type="url"
                  {...register('trailerUrl')}
                  placeholder="URL do trailer no YouTube"
                  icon={<FiYoutube />}
                  value={watch('trailerUrl') || ''}
                  showClearButton={!!watch('trailerUrl')}
                  onClear={() => setValue('trailerUrl', '')}
                />
                {errors.trailerUrl && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.trailerUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium mb-1"
                >
                  Orçamento (USD)
                </label>
                <Input
                  id="budget"
                  type="number"
                  {...register('budget')}
                  placeholder="Orçamento em dólares"
                  min="0"
                  step="0.01"
                  icon={<FiDollarSign />}
                  value={watch('budget') || ''}
                  showClearButton={!!watch('budget')}
                  onClear={() => setValue('budget', undefined)}
                />
                {errors.budget && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.budget.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="revenue"
                  className="block text-sm font-medium mb-1"
                >
                  Receita (USD)
                </label>
                <Input
                  id="revenue"
                  type="number"
                  {...register('revenue')}
                  placeholder="Receita em dólares"
                  min="0"
                  step="0.01"
                  icon={<FiDollarSign />}
                  value={watch('revenue') || ''}
                  showClearButton={!!watch('revenue')}
                  onClear={() => setValue('revenue', undefined)}
                />
                {errors.revenue && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.revenue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="popularity"
                  className="block text-sm font-medium mb-1"
                >
                  Popularidade
                </label>
                <Input
                  id="popularity"
                  type="number"
                  {...register('popularity')}
                  placeholder="Nível de popularidade"
                  min="0"
                  icon={<FiBarChart2 />}
                  value={watch('popularity') || ''}
                  showClearButton={!!watch('popularity')}
                  onClear={() => setValue('popularity', undefined)}
                />
                {errors.popularity && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.popularity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="voteCount"
                  className="block text-sm font-medium mb-1"
                >
                  Contagem de Votos
                </label>
                <Input
                  id="voteCount"
                  type="number"
                  {...register('voteCount')}
                  placeholder="Número total de votos"
                  min="0"
                  icon={<FiActivity />}
                  value={watch('voteCount') || ''}
                  showClearButton={!!watch('voteCount')}
                  onClear={() => setValue('voteCount', undefined)}
                />
                {errors.voteCount && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.voteCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium mb-1"
                >
                  Nota (0-10)
                </label>
                <Input
                  id="rating"
                  type="number"
                  {...register('rating')}
                  placeholder="Avaliação de 0 a 10"
                  min="0"
                  max="10"
                  step="0.1"
                  icon={<FiStar />}
                  value={watch('rating') || ''}
                  showClearButton={!!watch('rating')}
                  onClear={() => setValue('rating', undefined)}
                />
                {errors.rating && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="w-full p-3 border rounded-md bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-32"
                  placeholder="Descrição do filme"
                  value={watch('description') || ''}
                ></textarea>
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="genreIds"
                  className="block text-sm font-medium mb-1"
                >
                  Gêneros
                </label>
                <select
                  id="genreIds"
                  multiple
                  {...register('genreIds')}
                  className="w-full p-2 border rounded-md bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-40"
                >
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                {errors.genreIds && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.genreIds.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Use Ctrl+Clique para selecionar múltiplos gêneros
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
        </form>
      )}
    </Modal>
  )
}
