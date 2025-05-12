import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useSignupViewModel } from '@/features/auth/viewmodel/signup.viewmodel'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context/auth.context'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    setValue,
    watch,
  } = useSignupViewModel()
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
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              icon={<FiUser />}
              showClearButton
              onClear={() => setValue('name', '')}
              {...register('name')}
              value={watch('name') || ''}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium"
            >
              Confirme sua senha
            </label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="Confirme sua senha"
              icon={<FiLock />}
              {...register('passwordConfirmation')}
              value={watch('passwordConfirmation') || ''}
            />
            {errors.passwordConfirmation && (
              <p className="text-destructive text-sm">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className=""
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Carregando...' : 'Cadastrar'}
            </Button>
          </div>
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
