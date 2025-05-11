import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSignupViewModel } from '@/features/auth/viewmodel/signup.viewmodel'
import { Button } from '@/components/custom/button'
import { useAuth } from '@/features/auth/context/auth.context'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { register, handleSubmit, onSubmit, errors, isLoading } =
    useSignupViewModel()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="max-w-md w-full rounded-xs p-4 bg-card/80 backdrop-blur-sm shadow-xl border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Digite seu nome"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium"
            >
              Confirme sua senha
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              {...register('passwordConfirmation')}
              className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Confirme sua senha"
            />
            {errors.passwordConfirmation && (
              <p className="text-destructive text-sm">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? 'Carregando...' : 'Registrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
