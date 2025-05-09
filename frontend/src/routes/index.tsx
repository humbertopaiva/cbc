import { createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '@/features/auth/guards/auth.guard'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { useAuth } from '@/features/auth/context/auth.context'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user, logout } = useAuth()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CUBOS Movies</h1>
            <div className="flex items-center space-x-4">
              <span>Olá, {user?.name}</span>
              <ThemeToggle />
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-4">Filmes</h2>
          <p>Implemente a visualização de filmes aqui.</p>
        </main>
      </div>
    </AuthGuard>
  )
}
