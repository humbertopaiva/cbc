import React from 'react'
import { Link } from '@tanstack/react-router'
import { FiLogIn, FiUser } from 'react-icons/fi'
import { useAuth } from '@/features/auth/context/auth.context'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo responsiva (mobile e desktop) */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo-mobile.svg"
              alt="Logo Mobile"
              className="h-8 block md:hidden"
            />
            <img
              src="/logo-horizontal.svg"
              alt="Logo Desktop"
              className="h-8 hidden md:block"
            />
          </Link>

          {/* Botões lado direito */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm hidden md:inline">
                  Olá, {user?.name}
                </span>
                <ThemeToggle />
                <Button
                  onClick={logout}
                  className={cn(
                    'w-9 h-9 p-0 bg-purple-600 hover:bg-purple-700 text-white rounded-md',
                  )}
                >
                  <FiUser className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button
                  as={Link}
                  to="/login"
                  className={cn(
                    'w-9 h-9 p-0 bg-purple-600 hover:bg-purple-700 text-white rounded-md',
                  )}
                >
                  <FiLogIn className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
