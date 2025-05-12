import React from 'react'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card shadow-sm mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-muted-foreground py-3 flex items-center gap-1">
              {year} © Todos os direitos reservados a{'  '}
              <span className="font-bold">Cubos Movies</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
