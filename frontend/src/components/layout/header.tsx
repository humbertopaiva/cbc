import React from 'react'
import { Link } from '@tanstack/react-router'
import { FiFilm, FiHome, FiLogOut, FiUser } from 'react-icons/fi'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { useAuth } from '@/features/auth/context/auth.context'
import { Button } from '@/components/ui/button'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-card shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              CUBOS Movies
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition"
                activeProps={{
                  className: 'bg-secondary text-secondary-foreground',
                }}
                activeOptions={{ exact: true }}
              >
                <FiHome className="w-4 h-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/movies/new"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground transition"
                activeProps={{
                  className: 'bg-secondary text-secondary-foreground',
                }}
              >
                <FiFilm className="w-4 h-4" />
                <span>Novo Filme</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              <span className="hidden md:inline">Olá, {user?.name}</span>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
