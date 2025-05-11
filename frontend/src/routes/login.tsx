import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLoginViewModel } from '@/features/auth/viewmodel/login.viewmodel'
import { Button } from '@/components/custom/button'
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
    <div className="flex items-center justify-center flex-1">
      <div className="max-w-md w-full p-8 bg-card/90 backdrop-blur-sm shadow-xl border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/forgot-password"
              className="text-primary text-sm hover:underline"
            >
              Esqueci minha senha
            </Link>

            <Button
              type="submit"
              className="ml-auto"
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
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
