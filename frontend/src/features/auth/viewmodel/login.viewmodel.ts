import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { LOGIN } from '../graphql/auth.graphql'
import { useAuth } from '../context/auth.context'
import { loginSchema } from '../schemas/auth.schema'
import type { LoginInput, User } from '../model/auth.model'
import type { LoginFormData } from '../schemas/auth.schema'

export class LoginViewModel {
  constructor(private authContext: ReturnType<typeof useAuth>) {}

  setupForm() {
    return useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    })
  }

  setupMutation() {
    const [loginMutation, { loading }] = useMutation<
      {
        login: {
          token: string
          user: User
        }
      },
      { input: LoginInput }
    >(LOGIN, {
      onCompleted: (data) => {
        this.authContext.login(data.login.token, data.login.user)
        toast.success('Login realizado com sucesso!')
      },
      onError: (error) => {
        console.error('Login error:', error)
        toast.error('Erro ao fazer login. Verifique suas credenciais.')
        return error
      },
    })

    return { loginMutation, loading }
  }

  handleLoginError(error: Error, setError: any) {
    if (
      error.message.includes('credentials') ||
      error.message.includes('Invalid')
    ) {
      setError('email', { message: 'Email ou senha inválidos' })
      setError('password', { message: 'Email ou senha inválidos' })
    } else {
      toast.error('Ocorreu um erro durante o login. Tente novamente.')
    }
  }
}

export function useLoginViewModel() {
  const auth = useAuth()
  const viewModel = new LoginViewModel(auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = viewModel.setupForm()

  const { loginMutation, loading } = viewModel.setupMutation()

  const onSubmit = (data: LoginFormData) => {
    loginMutation({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    }).catch((error) => {
      viewModel.handleLoginError(error, setError)
    })
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading: loading,
    reset,
  }
}
