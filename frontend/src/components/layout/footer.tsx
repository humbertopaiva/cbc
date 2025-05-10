import React from 'react'

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-muted-foreground">
              © {year} CUBOS Movies. Todos os direitos reservados.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Desenvolvido com ❤️ para Cubos Tecnologia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
