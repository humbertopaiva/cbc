import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLoginViewModel } from '@/features/auth/viewmodel/login.viewmodel'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context/auth.context'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { register, handleSubmit, onSubmit, errors, isLoading } =
    useLoginViewModel()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">CUBOS Movies</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Digite seu email"
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
            <div className="mt-4 text-center space-y-2">
              <p className="text-sm">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Registre-se
                </Link>
              </p>
              <p className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
