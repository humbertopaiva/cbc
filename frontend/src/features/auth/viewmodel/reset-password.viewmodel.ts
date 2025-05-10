import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '../services/auth.service'

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function useResetPasswordViewModel(token: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await authService.resetPassword(token, data.newPassword)
      setSuccess(result.success)
      setMessage(result.message)
    } catch (error) {
      setSuccess(false)
      setMessage(
        'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
      )
      console.error('Error resetting password:', error)
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
