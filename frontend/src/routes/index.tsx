import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FiFilm, FiPlus, FiSearch } from 'react-icons/fi'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useMoviesListViewModel } from '@/features/movies/viewmodel/movies-list.viewmodel'
import { MovieCard } from '@/features/movies/components/movie-card'
import { FilterModal } from '@/features/movies/components/filter-modal'
import { MoviePagination } from '@/features/movies/components/movie-pagination'
import { CreateMovieModal } from '@/features/movies/components/create-movie-modal'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const {
    movies,
    genres,
    loading,
    filters,
    currentPage,
    totalPages,
    initialize,
    handleFilterChange,
    handlePageChange,
  } = useMoviesListViewModel()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchText, setSearchText] = useState(filters.search || '')

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSearch = () => {
    handleFilterChange({ ...filters, search: searchText })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchText('')
    handleFilterChange({ ...filters, search: '' })
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto lg:px-0">
        <div className="flex flex-col md:flex-row md:justify-end md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-2 justify-end w-full px-3 lg:px-0">
            <div className="relative flex-grow sm:max-w-3xl max-w-xl ">
              <Input
                type="text"
                placeholder="Pesquisar filme..."
                icon={<FiSearch />}
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                showClearButton={!!searchText}
                onClear={clearSearch}
              />
            </div>
            <div className="flex gap-2 flex-1l">
              <FilterModal
                genres={genres}
                currentFilters={filters}
                onApplyFilters={handleFilterChange}
              />
              <Button
                className="flex items-center gap-2 flex-1 md:flex-none  md:max-w-48 "
                onClick={() => setShowCreateModal(true)}
                variant="primary"
              >
                <span>Adicionar Filme</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Resto do código permanece o mesmo */}
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
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              <FiPlus className="w-4 h-4" />
              Adicionar Filme
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 bg-foreground/8 p-3 md:p-6">
              {movies?.edges.map(({ node }) => (
                <div key={node.id} className="h-full">
                  <MovieCard movie={node} />
                </div>
              ))}
            </div>

            <MoviePagination
              currentPage={currentPage}
              totalPages={totalPages}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* Modal de criação de filme */}
      <CreateMovieModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
