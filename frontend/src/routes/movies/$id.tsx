import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiArrowLeft, FiEdit, FiTrash2, FiYoutube } from 'react-icons/fi'
import { AuthGuard } from '@/features/auth/guards/auth.guard'
import { Button } from '@/components/ui/button'
import { useMovieDetailsViewModel } from '@/features/movies/viewmodel/movie-details.viewmodel'
import { MovieStatus } from '@/features/movies/model/movie.model'

export const Route = createFileRoute('/movies/$id')({
  component: MovieDetailsPage,
})

function MovieDetailsPage() {
  const { id } = useParams({ from: '/movies/$id' })
  const { movie, loading, isDeleting, fetchMovie, handleDelete } =
    useMovieDetailsViewModel(id)
  const [showTrailer, setShowTrailer] = useState(false)

  // Função para extrair o ID do vídeo do YouTube da URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  useEffect(() => {
    fetchMovie()
  }, [id])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  const youtubeVideoId = movie.trailerUrl
    ? getYoutubeVideoId(movie.trailerUrl)
    : null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" />
                Voltar para a lista
              </Button>
            </Link>
          </div>

          <div className="relative mb-8">
            <img
              src={
                movie.backdropUrl ||
                'https://placehold.co/1200x400?text=No+Backdrop'
              }
              alt={`Backdrop de ${movie.title}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <h1 className="text-white text-3xl font-bold">{movie.title}</h1>

              {movie.originalTitle && (
                <p className="text-white/90 text-lg italic">
                  {movie.originalTitle}
                </p>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <h1 className="text-white text-3xl font-bold">{movie.title}</h1>
              {movie.originalTitle && (
                <p className="text-white/90 text-lg italic">
                  {movie.originalTitle}
                </p>
              )}
              {movie.tagline && (
                <p className="text-white/80 mt-1 font-medium italic">
                  "{movie.tagline}"
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg overflow-hidden shadow-md">
                <img
                  src={
                    movie.imageUrl ||
                    'https://placehold.co/600x900?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full h-auto"
                />
                {movie.rating && (
                  <div className="p-4 flex justify-center items-center bg-primary/10">
                    <div className="text-xl font-bold">
                      <span className="text-3xl">{movie.rating}</span>/10
                    </div>
                  </div>
                )}
              </div>

              {youtubeVideoId && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowTrailer(true)}
                  >
                    <FiYoutube className="w-5 h-5 text-red-500" />
                    Assistir Trailer
                  </Button>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <Button
                  as={Link}
                  to="/movies/$id/edit"
                  params={{ id }}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FiTrash2 className="w-4 h-4" />
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Detalhes</h2>
                <div className="space-y-4">
                  {movie.description && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Descrição
                      </h3>
                      <p className="mt-1">{movie.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movie.releaseDate && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Data de Lançamento
                        </h3>
                        <p className="mt-1">
                          {format(new Date(movie.releaseDate), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    )}

                    {movie.status && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Situação
                        </h3>
                        <p className="mt-1">
                          {movie.status === MovieStatus.RELEASED
                            ? 'Lançado'
                            : 'Em Produção'}
                        </p>
                      </div>
                    )}

                    {movie.language && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Idioma
                        </h3>
                        <p className="mt-1">{movie.language}</p>
                      </div>
                    )}

                    {movie.duration && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Duração
                        </h3>
                        <p className="mt-1">{movie.duration} minutos</p>
                      </div>
                    )}

                    {movie.budget !== undefined && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Orçamento
                        </h3>
                        <p className="mt-1">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(movie.budget)}
                        </p>
                      </div>
                    )}

                    {movie.revenue !== undefined && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Receita
                        </h3>
                        <p className="mt-1">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(movie.revenue)}
                        </p>
                      </div>
                    )}

                    {movie.profit !== undefined && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Lucro
                        </h3>
                        <p
                          className={`mt-1 ${movie.profit < 0 ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(movie.profit)}
                        </p>
                      </div>
                    )}

                    {movie.popularity !== undefined && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Popularidade
                        </h3>
                        <p className="mt-1">{movie.popularity}</p>
                      </div>
                    )}

                    {movie.voteCount !== undefined && (
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Número de Votos
                        </h3>
                        <p className="mt-1">{movie.voteCount}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Adicionado por
                      </h3>
                      <p className="mt-1">{movie.createdBy.name}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Data de Criação
                      </h3>
                      <p className="mt-1">
                        {format(new Date(movie.createdAt), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Última Atualização
                      </h3>
                      <p className="mt-1">
                        {format(new Date(movie.updatedAt), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold mb-4">Gêneros</h2>
                {movie.genres.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum gênero associado a este filme.
                  </p>
                )}
              </div>
            </div>
          </div>

          {showTrailer && youtubeVideoId && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="relative w-full max-w-3xl">
                <button
                  className="absolute -top-8 right-0 text-white"
                  onClick={() => setShowTrailer(false)}
                >
                  Fechar
                </button>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
