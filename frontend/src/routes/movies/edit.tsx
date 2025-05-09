import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'
import { Button } from '@/components/ui/button'
import { useUpdateMovieViewModel } from '@/features/movies/viewmodel/movie-form.viewmodel'

export const Route = createFileRoute('/movies/edit')({
  component: EditMoviePage,
})

function EditMoviePage() {
  const { id } = useParams({ from: '/movies/$id/edit' })
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    movie,
    genres,
    loading,
    isSubmitting,
    onSubmit,
    fetchData,
  } = useUpdateMovieViewModel(id)

  useEffect(() => {
    fetchData()
  }, [id])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/movies/$id" params={{ id }}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FiArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Editar Filme</h1>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando...</p>
            </div>
          ) : !movie ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">
                Filme não encontrado ou você não tem permissão para editá-lo.
              </p>
              <Link to="/">
                <Button variant="outline">Voltar para a lista</Button>
              </Link>
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
                        htmlFor="rating"
                        className="block text-sm font-medium mb-1"
                      >
                        Avaliação (0-10)
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

                  <div className="space-y-4">
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
                        htmlFor="imageUrl"
                        className="block text-sm font-medium mb-1"
                      >
                        URL da Imagem
                      </label>
                      <input
                        id="imageUrl"
                        type="text"
                        {...register('imageUrl')}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="URL da imagem de capa"
                      />
                      {errors.imageUrl && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.imageUrl.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="backdropUrl"
                        className="block text-sm font-medium mb-1"
                      >
                        URL do Backdrop
                      </label>
                      <input
                        id="backdropUrl"
                        type="text"
                        {...register('backdropUrl')}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="URL da imagem de fundo"
                      />
                      {errors.backdropUrl && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.backdropUrl.message}
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

                <div className="flex justify-end gap-2 pt-4">
                  <Link to="/movies/$id" params={{ id }}>
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
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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
