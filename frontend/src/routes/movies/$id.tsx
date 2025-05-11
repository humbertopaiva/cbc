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
          <div className="flex justify-center items-center h-64">
            <p>Carregando detalhes do filme...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!movie) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground mb-4">
              Filme não encontrado ou você não tem permissão para visualizá-lo.
            </p>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" />
                Voltar para a lista
              </Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        {/* Botão de voltar */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="text-white">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Primeira seção: Detalhes do filme */}
        <div
          className="relative"
          style={{
            backgroundImage: `url(${movie.backdropUrl || 'https://placehold.co/1200x800?text=No+Backdrop'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/70"></div>

          <div className="container mx-auto px-4 py-10 relative z-10">
            {/* Header com título e botões */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                {movie.originalTitle && (
                  <h2 className="text-xl text-white/70 italic">
                    {movie.originalTitle}
                  </h2>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 flex items-center gap-2"
                  as={Link}
                  to="/movies/$id/edit"
                  params={{ id }}
                >
                  <FiEdit className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FiTrash2 className="w-4 h-4" />
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>

            {/* Conteúdo principal em 3 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primeira coluna: Poster */}
              <div>
                <img
                  src={
                    movie.imageUrl ||
                    'https://placehold.co/300x450?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Segunda coluna: Frase de efeito, sinopse e gêneros */}
              <div className="flex flex-col">
                {/* Bloco 1: Frase de efeito */}
                {movie.tagline && (
                  <div className="mb-6">
                    <p className="text-lg italic text-yellow-400">
                      "{movie.tagline}"
                    </p>
                  </div>
                )}

                {/* Bloco 2: Sinopse e gêneros */}
                <div className="flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold uppercase mb-2">
                      SINOPSE
                    </h3>
                    <p className="text-white/80">
                      {movie.description || 'Nenhuma descrição disponível.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold uppercase mb-2">
                      GÊNEROS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.length > 0 ? (
                        movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-white/60">
                          Nenhum gênero cadastrado
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terceira coluna: Informações técnicas */}
              <div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {movie.releaseDate && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        LANÇAMENTO
                      </h4>
                      <p className="text-sm">
                        {format(new Date(movie.releaseDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  )}

                  {movie.duration && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        DURAÇÃO
                      </h4>
                      <p className="text-sm">{movie.duration} min</p>
                    </div>
                  )}

                  {movie.status && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        SITUAÇÃO
                      </h4>
                      <p className="text-sm">
                        {movie.status === MovieStatus.RELEASED
                          ? 'Lançado'
                          : 'Em Produção'}
                      </p>
                    </div>
                  )}

                  {movie.language && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        IDIOMA
                      </h4>
                      <p className="text-sm">{movie.language}</p>
                    </div>
                  )}

                  {movie.budget !== undefined && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        ORÇAMENTO
                      </h4>
                      <p className="text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(movie.budget)}
                      </p>
                    </div>
                  )}

                  {movie.revenue !== undefined && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        RECEITA
                      </h4>
                      <p className="text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(movie.revenue)}
                      </p>
                    </div>
                  )}

                  {movie.popularity !== undefined && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        POPULARIDADE
                      </h4>
                      <p className="text-sm">{movie.popularity}</p>
                    </div>
                  )}

                  {movie.rating !== undefined && (
                    <div>
                      <h4 className="text-xs font-semibold text-white/50 uppercase">
                        AVALIAÇÃO
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
                          {movie.rating}
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
          <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Trailer</h2>
            <div className="aspect-video bg-black/30 rounded-lg overflow-hidden">
              <MovieTrailer trailerUrl={movie.trailerUrl} />
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
