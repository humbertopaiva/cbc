import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiMail } from 'react-icons/fi'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
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
    setValue,
    watch,
  } = useForgotPasswordViewModel()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="flex items-center justify-center flex-1 p-6">
      <div className="max-w-md w-full rounded-xs p-4 bg-card/80 backdrop-blur-sm shadow-xl border border-border">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Recuperar Senha
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu e-mail para receber instruções.
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
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                icon={<FiMail />}
                showClearButton
                onClear={() => setValue('email', '')}
                {...register('email')}
                value={watch('email') || ''}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {message && !errors.email && (
              <p className="text-sm text-destructive text-center">{message}</p>
            )}

            <div className="pt-2 flex justify-between items-center">
              <Link
                to="/login"
                className="text-primary text-sm hover:underline"
              >
                Voltar para o login
              </Link>
              <Button
                type="submit"
                className="ml-auto"
                disabled={isLoading}
                variant="primary"
              >
                {isLoading ? 'Enviando...' : 'Recuperar'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
