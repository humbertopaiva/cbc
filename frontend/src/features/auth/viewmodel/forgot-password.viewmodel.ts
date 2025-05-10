import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '../services/auth.service'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function useForgotPasswordViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await authService.requestPasswordReset(data.email)
      setSuccess(result.success)
      setMessage(result.message)
    } catch (error) {
      setSuccess(false)
      setMessage(
        'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
      )
      console.error('Error requesting password reset:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    message,
    success,
  }
}
