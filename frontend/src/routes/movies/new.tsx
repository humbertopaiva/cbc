import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'
import { Button } from '@/components/ui/button'
import { useCreateMovieViewModel } from '@/features/movies/viewmodel/movie-form.viewmodel'
import { ImageUpload } from '@/features/movies/components/image-upload'
import { MovieStatus } from '@/features/movies/model/movie.model'

export const Route = createFileRoute('/movies/new')({
  component: CreateMoviePage,
})

function CreateMoviePage() {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    genres,
    loading,
    isSubmitting,
    onSubmit,
    fetchGenres,
  } = useCreateMovieViewModel()

  useEffect(() => {
    fetchGenres()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <FiArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Novo Filme</h1>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando...</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-6 shadow-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium mb-1"
                      >
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
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium mb-1"
                      >
                        Situação
                      </label>
                      <select
                        id="status"
                        {...register('status')}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">Selecione a situação</option>
                        <option value={MovieStatus.RELEASED}>Lançado</option>
                        <option value={MovieStatus.IN_PRODUCTION}>
                          Em Produção
                        </option>
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

                    <div>
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

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium mb-1"
                      >
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
                      <label
                        htmlFor="revenue"
                        className="block text-sm font-medium mb-1"
                      >
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
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium mb-1"
                      >
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
                        className="w-full p-2 border rounded-md bg-background h-40"
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

                <div className="flex justify-end gap-2 pt-4">
                  <Link to="/">
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <FiSave className="w-4 h-4" />
                    {isSubmitting ? 'Salvando...' : 'Salvar Filme'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
