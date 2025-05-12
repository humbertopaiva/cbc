import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiArrowLeft } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'

import { useMovieDetailsViewModel } from '@/features/movies/viewmodel/movie-details.viewmodel'
import { MovieStatus } from '@/features/movies/model/movie.model'
import { MovieTrailer } from '@/features/movies/components/movie-trailer'
import { EditMovieModal } from '@/features/movies/components/edit-movie-modal'
import { Button } from '@/components/custom/button'
import { RatingCircle } from '@/features/movies/components/rating-circle'

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
  }, [fetchMovie, id])

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
            <p>Carregando detalhes do filme...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!movie) {
    return (
      <AuthGuard>
        <div className="min-h-screen">
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
      <div className="min-h-screen">
        {/* Primeira seção: Detalhes do filme */}
        <div
          className="relative"
          style={{
            backgroundImage: `url(${movie.backdropUrl || 'https://placehold.co/1200x800?text=No+Backdrop'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay escuro - Adaptado para o modo escuro */}
          <div className="absolute inset-0 bg-gradient-to-r from-card/100 via-card/70 to-card/30 dark:from-card/95 dark:via-card/80 dark:to-card/50"></div>

          <div className="container mx-auto px-4 py-6 relative z-10">
            {/* Mobile: Poster first */}
            <div className="md:hidden mb-4">
              <img
                src={
                  movie.imageUrl || 'https://placehold.co/300x450?text=No+Image'
                }
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Mobile: Buttons after poster */}
            <div className="md:hidden flex justify-center lg:justify-end gap-3 mb-4">
              <Button
                variant="secondary"
                className="flex items-center gap-2 flex-1 lg:flex-none"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-2 flex-1 lg:flex-none"
                onClick={() => setShowEditModal(true)}
              >
                Editar
              </Button>
            </div>

            {/* Header with title and buttons in one line on desktop */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              {/* Títulos */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-sans font-semibold text-white dark:text-white">
                  {movie.title}
                </h1>
                {movie.originalTitle && (
                  <h2 className="text-xl text-white/70 dark:text-white/70">
                    {movie.originalTitle}
                  </h2>
                )}
              </div>

              {/* Desktop buttons - now aligned with titles */}
              <div className="flex gap-3 mt-4 md:mt-0">
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

            {/* Layout de 2 colunas com a primeira menor */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,2fr)_5fr] gap-8">
              {/* Primeira coluna: Poster - hidden on mobile (already shown above) */}
              <div className="hidden md:block">
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
                      <p className="text-lg italic text-white dark:text-white">
                        {movie.tagline}
                      </p>
                    )}
                  </div>

                  {/* Métricas à direita - Transformadas em boxes */}
                  <div className="md:w-1/2 flex flex-wrap justify-end gap-3 mt-4 md:mt-0">
                    {/* Popularidade como box */}
                    {movie.popularity !== undefined && (
                      <div className="bg-card/80  dark:bg-card/40 p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-sans font-semibold text-foreground/70 dark:text-white/70 uppercase">
                          POPULARIDADE
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {movie.popularity}
                        </p>
                      </div>
                    )}

                    {/* Votos como box */}
                    {movie.voteCount !== undefined && (
                      <div className="bg-card/80  dark:bg-card/40 p-3 rounded-xs flex flex-col items-center justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          VOTOS
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {movie.voteCount}
                        </p>
                      </div>
                    )}

                    {/* Rating circle */}
                    {movie.rating !== undefined && (
                      <RatingCircle rating={movie.rating} size={80} />
                    )}
                  </div>
                </div>

                {/* Segunda seção: Sinopse e informações técnicas em duas colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coluna 1: Sinopse */}
                  <div className="bg-card/90  p-4 rounded-xs h-full">
                    <h3 className="text-lg font-sans font-semibold uppercase mb-2 text-foreground dark:text-foreground">
                      SINOPSE
                    </h3>
                    <p className="text-foreground/80 dark:text-foreground/80 font-sans">
                      {movie.description || 'Nenhuma descrição disponível.'}
                    </p>
                  </div>

                  {/* Coluna 2: Informações técnicas em cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {movie.releaseDate && (
                      <div className="bg-card/90  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          LANÇAMENTO
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {format(new Date(movie.releaseDate), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    )}

                    {movie.duration && (
                      <div className="bg-card/95  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          DURAÇÃO
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {movie.duration} min
                        </p>
                      </div>
                    )}

                    {movie.status && (
                      <div className="bg-card/95  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          SITUAÇÃO
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {movie.status === MovieStatus.RELEASED
                            ? 'Lançado'
                            : 'Em Produção'}
                        </p>
                      </div>
                    )}

                    {movie.language && (
                      <div className="bg-card/90  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          IDIOMA
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {movie.language}
                        </p>
                      </div>
                    )}

                    {movie.budget !== undefined && (
                      <div className="bg-card/90  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          ORÇAMENTO
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          }).format(movie.budget)}
                        </p>
                      </div>
                    )}

                    {movie.revenue !== undefined && (
                      <div className="bg-card/90  p-3 rounded-xs flex flex-col justify-between">
                        <h4 className="text-xs font-semibold text-foreground/70 dark:text-foreground/70 uppercase">
                          RECEITA
                        </h4>
                        <p className="text-sm text-foreground dark:text-foreground">
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

                {/* Terceira seção: Gêneros - limitada ao tamanho do conteúdo */}
                <div className="bg-card/90  p-4 rounded-xs inline-block">
                  <h3 className="text-lg font-semibold uppercase mb-2 font-sans text-foreground">
                    GÊNEROS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.length > 0 ? (
                      movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 bg-primary/50 dark:bg-primary/30 py-2 font-sans rounded-xs text-sm uppercase text-white"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-foreground">
                        Nenhum gênero cadastrado
                      </p>
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
            <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-foreground">
              Trailer
            </h2>
            <div className="aspect-video bg-black/30 dark:bg-black/50 rounded-lg overflow-hidden">
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
