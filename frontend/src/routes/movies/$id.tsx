import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'

import { useMovieDetailsViewModel } from '@/features/movies/viewmodel/movie-details.viewmodel'
import { MovieStatus } from '@/features/movies/model/movie.model'
import { MovieTrailer } from '@/features/movies/components/movie-trailer'
import { EditMovieModal } from '@/features/movies/components/edit-movie-modal'
import { Button } from '@/components/custom/button'

export const Route = createFileRoute('/movies/$id')({
  component: MovieDetailsPage,
})

function MovieDetailsPage() {
  const { id } = useParams({ from: '/movies/$id' })
  const { movie, loading, isDeleting, fetchMovie, handleDelete } =
    useMovieDetailsViewModel(id)

  const [showEditModal, setShowEditModal] = useState(false)

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
      <div className="min-h-screen text-white">
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

          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.3) 100%)',
            }}
          ></div>

          <div className="container mx-auto px-4 py-6 relative z-10">
            {/* Header com título e botões */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col">
                <h1 className="text-3xl font-sans">{movie.title}</h1>
                {movie.originalTitle && (
                  <h2 className="text-xl text-white/70">
                    {movie.originalTitle}
                  </h2>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deletando...' : 'Deletar'}
                </Button>
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                  onClick={() => setShowEditModal(true)}
                >
                  Editar
                </Button>
              </div>
            </div>

            {/* Novo layout: 2 colunas com a primeira menor */}
            <div
              className="grid grid-cols-1 md:grid-template-columns-custom gap-8"
              style={{ gridTemplateColumns: 'minmax(200px, 2fr) 5fr' }}
            >
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

              {/* Segunda coluna: Dividida em três seções */}
              <div className="flex flex-col space-y-6">
                {/* Primeira seção: Frase de efeito e métricas */}
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Frase de efeito à esquerda */}
                  <div className="md:w-1/2">
                    {movie.tagline && (
                      <p className="text-lg italic text-foreground/90">
                        {movie.tagline}
                      </p>
                    )}
                  </div>

                  {/* Métricas à direita */}
                  <div className="md:w-1/2 flex justify-end space-x-4 mt-4 md:mt-0">
                    {/* Popularidade */}
                    {movie.popularity !== undefined && (
                      <div className="flex flex-col items-center">
                        <h4 className="text-xs font-semibold text-white/50 uppercase">
                          POPULARIDADE
                        </h4>
                        <p className="text-sm">{movie.popularity}</p>
                      </div>
                    )}

                    {/* Votos (assumindo que existe um campo para votos) */}
                    {movie.voteCount !== undefined && (
                      <div className="flex flex-col items-center">
                        <h4 className="text-xs font-semibold text-white/50 uppercase">
                          VOTOS
                        </h4>
                        <p className="text-sm">{movie.voteCount}</p>
                      </div>
                    )}

                    {/* Rating circle */}
                    {movie.rating !== undefined && (
                      <div className="flex flex-col items-center">
                        <h4 className="text-xs font-semibold text-white/50 uppercase">
                          AVALIAÇÃO
                        </h4>
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
                          {movie.rating}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Segunda seção: Sinopse e informações técnicas em duas colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coluna 1: Sinopse */}
                  <div className="bg-card p-4 rounded-xs h-full">
                    <h3 className="text-lg font-sans font-semibold uppercase mb-2">
                      SINOPSE
                    </h3>
                    <p className="text-white/80 font-sans">
                      {movie.description || 'Nenhuma descrição disponível.'}
                    </p>
                  </div>

                  {/* Coluna 2: Informações técnicas em cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {movie.releaseDate && (
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
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
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-white/50 uppercase">
                          DURAÇÃO
                        </h4>
                        <p className="text-sm">{movie.duration} min</p>
                      </div>
                    )}

                    {movie.status && (
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
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
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-white/50 uppercase">
                          IDIOMA
                        </h4>
                        <p className="text-sm">{movie.language}</p>
                      </div>
                    )}

                    {movie.budget !== undefined && (
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
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
                      <div className="bg-card p-3 rounded-xs flex flex-col justify-between">
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
                  </div>
                </div>

                {/* Terceira seção: Gêneros */}
                <div className="bg-card p-4 rounded-xs">
                  <h3 className="text-lg font-semibold uppercase mb-2 font-sans">
                    GÊNEROS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.length > 0 ? (
                      movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 bg-primary/50 py-2 font-sans rounded-xs text-sm uppercase"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-white/60">Nenhum gênero cadastrado</p>
                    )}
                  </div>
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

      <EditMovieModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false)
          fetchMovie() // Para atualizar os dados após edição
        }}
        movieId={id}
      />
    </AuthGuard>
  )
}
