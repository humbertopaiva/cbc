import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
    })
  }

  setupMutation() {
    const [loginMutation, { loading }] = useMutation<
      {
        login: {
          token: string
          user: { id: string; name: string; email: string }
        }
      },
      { input: LoginInput }
    >(LOGIN, {
      onCompleted: (data) => {
        if (data.login) {
          const user: User = {
            id: data.login.user.id,
            name: data.login.user.name,
            email: data.login.user.email,
          }
          this.authContext.login(data.login.token, user)
        }
      },
      onError: (error) => {
        console.error('Login error:', error)
        return error
      },
    })

    return { loginMutation, loading }
  }

  handleLoginError(error: Error, setError: any) {
    if (error.message.includes('credentials')) {
      setError('email', { message: 'Email ou senha inválidos' })
      setError('password', { message: 'Email ou senha inválidos' })
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
    }).catch((error) => viewModel.handleLoginError(error, setError))
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading: loading,
  }
}
