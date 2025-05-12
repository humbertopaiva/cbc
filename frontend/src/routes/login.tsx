import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiLock, FiMail } from 'react-icons/fi'
import { useLoginViewModel } from '@/features/auth/viewmodel/login.viewmodel'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context/auth.context'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    setValue,
    watch,
  } = useLoginViewModel()
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
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              icon={<FiLock />}
              {...register('password')}
              value={watch('password') || ''}
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
