import {
  Link,
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useResetPasswordViewModel } from '@/features/auth/viewmodel/reset-password.viewmodel'
import { useAuth } from '@/features/auth/context/auth.context'

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">CUBOS Movies</h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          Definir Nova Senha
        </h2>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-md">
              {message}
            </div>
            <p className="mt-4">
              <Link to="/login" className="text-primary hover:underline">
                Ir para o login
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground text-center">
              Digite sua nova senha abaixo.
            </p>

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
                  className="w-full p-2 border rounded-md bg-background"
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
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="Confirme sua nova senha"
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {message && !success && (
                <p className="text-destructive text-sm">{message}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Salvar Nova Senha'}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <p className="text-sm">
                <Link to="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
