import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context/auth.context'
import { useForgotPasswordViewModel } from '@/features/auth/viewmodel/forgot-password.viewmodel'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    message,
    success,
  } = useForgotPasswordViewModel()
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
          Recuperação de Senha
        </h2>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-md">
              {message}
            </div>
            <p className="mt-4">
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-muted-foreground text-center">
              Informe seu email para receber as instruções de recuperação de
              senha.
            </p>

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
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {message && <p className="text-destructive text-sm">{message}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Recuperar Senha'}
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
