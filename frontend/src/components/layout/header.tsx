import React from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/context/auth.context'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { Button } from '@/components/custom/button'

export const Header: React.FC = () => {
  const { logout } = useAuth()

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
            <ThemeToggle />
            <Button onClick={logout} variant="primary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
