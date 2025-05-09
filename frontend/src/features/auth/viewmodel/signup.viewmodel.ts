import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { SIGN_UP } from '../graphql/auth.graphql'
import { useAuth } from '../context/auth.context'
import { signupSchema } from '../schemas/auth.schema'
import type { SignUpInput, User } from '../model/auth.model'
import type { SignupFormData } from '../schemas/auth.schema'

export class SignupViewModel {
  constructor(private authContext: ReturnType<typeof useAuth>) {}

  setupForm() {
    return useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    })
  }

  setupMutation() {
    const [signupMutation, { loading }] = useMutation<
      {
        signUp: {
          token: string
          user: User
        }
      },
      { input: SignUpInput }
    >(SIGN_UP, {
      onCompleted: (data) => {
        this.authContext.login(data.signUp.token, data.signUp.user)
        toast.success('Cadastro realizado com sucesso!')
      },
      onError: (error) => {
        console.error('Signup error:', error)
        toast.error('Erro ao realizar cadastro.')
        return error
      },
    })

    return { signupMutation, loading }
  }

  handleSignupError(error: Error, setError: any) {
    if (error.message.includes('Email already in use')) {
      setError('email', { message: 'Este email já está em uso' })
    } else if (error.message.includes('Passwords do not match')) {
      setError('passwordConfirmation', { message: 'As senhas não coincidem' })
    } else {
      toast.error('Ocorreu um erro durante o cadastro. Tente novamente.')
    }
  }
}

export function useSignupViewModel() {
  const auth = useAuth()
  const viewModel = new SignupViewModel(auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = viewModel.setupForm()

  const { signupMutation, loading } = viewModel.setupMutation()

  const onSubmit = (data: SignupFormData) => {
    signupMutation({
      variables: {
        input: {
          name: data.name,
          email: data.email,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
      },
    }).catch((error) => {
      viewModel.handleSignupError(error, setError)
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
