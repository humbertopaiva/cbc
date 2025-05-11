import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiFilm, FiPlus, FiSearch } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useMoviesListViewModel } from '@/features/movies/viewmodel/movies-list.viewmodel'
import { MovieCard } from '@/features/movies/components/movie-card'
import { FilterModal } from '@/features/movies/components/filter-modal'
import { Layout } from '@/components/layout/layout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const {
    movies,
    genres,
    loading,
    loadingMore,
    filters,
    initialize,
    handleFilterChange,
    handleLoadMore,
  } = useMoviesListViewModel()

  useEffect(() => {
    initialize()
  }, [])

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar filme..."
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border bg-background"
                value={filters.search || ''}
                onChange={(e) =>
                  handleFilterChange({ ...filters, search: e.target.value })
                }
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <FilterModal
                genres={genres}
                currentFilters={filters}
                onApplyFilters={handleFilterChange}
              />
              <Link to="/movies/new">
                <Button className="flex items-center gap-2">
                  <FiPlus className="w-4 h-4" />
                  <span>Novo Filme</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {loading && !movies ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
              <p>Carregando filmes...</p>
            </div>
          </div>
        ) : movies?.edges.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg shadow">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FiFilm className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhum filme encontrado
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Não encontramos nenhum filme com os filtros atuais. Tente ajustar
              os filtros ou adicione um novo filme.
            </p>
            <Link to="/movies/new">
              <Button className="flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                Adicionar Filme
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 bg-foreground/8 p-6">
              {movies?.edges.map(({ node }) => (
                <div key={node.id} className="h-full">
                  <MovieCard movie={node} />
                </div>
              ))}
            </div>

            {movies?.pageInfo.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-40"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-t-current rounded-full animate-spin"></div>
                      <span>Carregando...</span>
                    </div>
                  ) : (
                    'Carregar mais'
                  )}
                </Button>
              </div>
            )}

            {movies?.pageInfo.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-40"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-t-current rounded-full animate-spin"></div>
                      <span>Carregando...</span>
                    </div>
                  ) : (
                    'Carregar mais'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
