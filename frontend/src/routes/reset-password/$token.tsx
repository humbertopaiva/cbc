import {
  Link,
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '@/components/custom/button'

import { useAuth } from '@/features/auth/context/auth.context'
import { useResetPasswordViewModel } from '@/features/auth/viewmodel/reset-password.viewmodel'

export const Route = createFileRoute('/reset-password/$token')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = useParams({ from: '/reset-password/$token' })
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    message,
    success,
  } = useResetPasswordViewModel(token)
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Definir Nova Senha
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digite sua nova senha abaixo.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm p-4 rounded-md">
              {message}
            </div>
            <Button asChild variant="outline">
              <Link to="/login">Voltar para o login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                Nova Senha
              </label>
              <input
                id="newPassword"
                type="password"
                {...register('newPassword')}
                className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Digite sua nova senha"
              />
              {errors.newPassword && (
                <p className="text-destructive text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirme a Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="w-full p-3 border bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirme sua nova senha"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {message && !success && (
              <p className="text-destructive text-sm text-center">{message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Salvar Nova Senha'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
