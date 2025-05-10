import React from 'react'
import { Link } from '@tanstack/react-router'
import { FiFilm, FiLogIn, FiUser } from 'react-icons/fi'
import { useAuth } from '@/features/auth/context/auth.context'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { Button } from '@/components/ui/button'

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-card  shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo à esquerda */}
          <Link to="/" className="flex items-center gap-2 text-primary">
            <FiFilm className="h-6 w-6" />
            <span className="text-xl font-bold hidden sm:inline">
              CUBOS Movies
            </span>
          </Link>

          {/* Controles à direita */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm hidden md:inline">
                  Olá, {user?.name}
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <FiUser className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/login" className="flex items-center gap-1">
                <FiLogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
