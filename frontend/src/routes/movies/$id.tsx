import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'
import { Button } from '@/components/ui/button'
import { useMovieDetailsViewModel } from '@/features/movies/viewmodel/movie-details.viewmodel'
import { MovieStatus } from '@/features/movies/model/movie.model'
import { MovieTrailer } from '@/features/movies/components/movie-trailer'

export const Route = createFileRoute('/movies/$id')({
  component: MovieDetailsPage,
})

function MovieDetailsPage() {
  const { id } = useParams({ from: '/movies/$id' })
  const { movie, loading, isDeleting, fetchMovie, handleDelete } =
    useMovieDetailsViewModel(id)

  useEffect(() => {
    fetchMovie()
  }, [id])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <p>Carregando detalhes do filme...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!movie) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">
                Filme não encontrado ou você não tem permissão para
                visualizá-lo.
              </p>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <FiArrowLeft className="w-4 h-4" />
                  Voltar para a lista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header com navegação de volta */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" />
                Voltar para a lista
              </Button>
            </Link>
          </div>
        </div>

        {/* Primeira seção: Informações do filme com backdrop como fundo */}
        <div
          className="relative py-12 mb-10"
          style={{
            backgroundImage: `url(${movie.backdropUrl || 'https://placehold.co/1200x400?text=No+Backdrop'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay com blur */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primeira coluna: Título e poster */}
              <div className="flex flex-col">
                <div className="bg-card/40 backdrop-blur-md shadow-lg rounded-lg overflow-hidden mb-4">
                  <img
                    src={
                      movie.imageUrl ||
                      'https://placehold.co/600x900?text=No+Image'
                    }
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-4 bg-card/40 backdrop-blur-md shadow-lg rounded-lg text-white">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {movie.title}
                  </h1>
                  {movie.originalTitle && (
                    <p className="text-lg italic text-white/80">
                      {movie.originalTitle}
                    </p>
                  )}
                  <div className="flex mt-4 space-x-2">
                    <Button
                      as={Link}
                      to="/movies/$id/edit"
                      params={{ id }}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20"
                    >
                      <FiEdit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Segunda coluna: Frase de efeito, sinopse e gêneros */}
              <div className="p-6 bg-card/40 backdrop-blur-md shadow-lg rounded-lg text-white">
                {movie.tagline && (
                  <div className="mb-6">
                    <p className="text-xl italic font-light text-white/90">
                      "{movie.tagline}"
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Sinopse</h2>
                  <p className="text-white/90">
                    {movie.description || 'Nenhuma descrição disponível.'}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Gêneros</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.length > 0 ? (
                      movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-white/70">Nenhum gênero associado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terceira coluna: Informações adicionais */}
              <div className="p-6 bg-card/40 backdrop-blur-md shadow-lg rounded-lg text-white">
                <h2 className="text-xl font-semibold mb-4">Informações</h2>
                <div className="space-y-3">
                  {movie.releaseDate && (
                    <div>
                      <h3 className="font-medium text-white/70">
                        Data de Lançamento
                      </h3>
                      <p>
                        {format(new Date(movie.releaseDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  )}

                  {movie.status && (
                    <div>
                      <h3 className="font-medium text-white/70">Situação</h3>
                      <p>
                        {movie.status === MovieStatus.RELEASED
                          ? 'Lançado'
                          : 'Em Produção'}
                      </p>
                    </div>
                  )}

                  {movie.language && (
                    <div>
                      <h3 className="font-medium text-white/70">Idioma</h3>
                      <p>{movie.language}</p>
                    </div>
                  )}

                  {movie.duration && (
                    <div>
                      <h3 className="font-medium text-white/70">Duração</h3>
                      <p>{movie.duration} minutos</p>
                    </div>
                  )}

                  {movie.budget !== undefined && (
                    <div>
                      <h3 className="font-medium text-white/70">Orçamento</h3>
                      <p>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(movie.budget)}
                      </p>
                    </div>
                  )}

                  {movie.revenue !== undefined && (
                    <div>
                      <h3 className="font-medium text-white/70">Receita</h3>
                      <p>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(movie.revenue)}
                      </p>
                    </div>
                  )}

                  {movie.profit !== undefined && (
                    <div>
                      <h3 className="font-medium text-white/70">Lucro</h3>
                      <p
                        className={
                          movie.profit < 0 ? 'text-red-500' : 'text-green-500'
                        }
                      >
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(movie.profit)}
                      </p>
                    </div>
                  )}

                  {movie.rating !== undefined && (
                    <div>
                      <h3 className="font-medium text-white/70">Avaliação</h3>
                      <div className="flex items-center">
                        <div className="bg-white/20 px-2 py-1 rounded-md">
                          <span className="font-bold">{movie.rating}</span>
                          <span className="text-sm text-white/80">/10</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda seção: Trailer do filme */}
        {movie.trailerUrl && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-2xl font-bold mb-6">Trailer</h2>
            <div className="aspect-video bg-black/10 rounded-lg overflow-hidden">
              <MovieTrailer trailerUrl={movie.trailerUrl} />
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
