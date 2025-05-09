import React, { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import type { Genre, MovieFilters } from '../model/movie.model'
import { Button } from '@/components/ui/button'

interface FilterModalProps {
  genres: Array<Genre>
  currentFilters: MovieFilters
  onApplyFilters: (filters: MovieFilters) => void
}

export const FilterModal: React.FC<FilterModalProps> = ({
  genres,
  currentFilters,
  onApplyFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<MovieFilters>(currentFilters)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    const numericTypes = ['number', 'range']

    if (name === 'genreIds') {
      const select = e.target as HTMLSelectElement
      const selectedOptions = Array.from(
        select.selectedOptions,
        (option) => option.value,
      )
      setFilters((prev) => ({ ...prev, genreIds: selectedOptions }))
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: numericTypes.includes(type) && value ? Number(value) : value,
      }))
    }
  }

  const handleApply = () => {
    onApplyFilters(filters)
    handleClose()
  }

  const handleClear = () => {
    const emptyFilters: MovieFilters = {}
    setFilters(emptyFilters)
    onApplyFilters(emptyFilters)
    handleClose()
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="flex items-center gap-2"
      >
        <FiFilter className="w-4 h-4" />
        Filtros
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filtros</h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium mb-1"
                >
                  Pesquisar
                </label>
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={filters.search || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="Título, título original ou descrição"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="minDuration"
                    className="block text-sm font-medium mb-1"
                  >
                    Duração Mínima (min)
                  </label>
                  <input
                    id="minDuration"
                    name="minDuration"
                    type="number"
                    min="0"
                    value={filters.minDuration || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxDuration"
                    className="block text-sm font-medium mb-1"
                  >
                    Duração Máxima (min)
                  </label>
                  <input
                    id="maxDuration"
                    name="maxDuration"
                    type="number"
                    min="0"
                    value={filters.maxDuration || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="releaseDateFrom"
                    className="block text-sm font-medium mb-1"
                  >
                    Data de Lançamento (De)
                  </label>
                  <input
                    id="releaseDateFrom"
                    name="releaseDateFrom"
                    type="date"
                    value={filters.releaseDateFrom || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="releaseDateTo"
                    className="block text-sm font-medium mb-1"
                  >
                    Data de Lançamento (Até)
                  </label>
                  <input
                    id="releaseDateTo"
                    name="releaseDateTo"
                    type="date"
                    value={filters.releaseDateTo || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
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
                  name="genreIds"
                  multiple
                  className="w-full p-2 border rounded-md bg-background h-32"
                  value={filters.genreIds || []}
                  onChange={handleChange}
                >
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Use Ctrl+Clique para selecionar múltiplos gêneros
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleClear}>
                  Limpar
                </Button>
                <Button onClick={handleApply}>Aplicar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
