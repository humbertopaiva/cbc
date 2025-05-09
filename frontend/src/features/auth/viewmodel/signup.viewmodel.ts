import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
    })
  }

  setupMutation() {
    const [signupMutation, { loading }] = useMutation<
      {
        signUp: {
          token: string
          user: { id: string; name: string; email: string }
        }
      },
      { input: SignUpInput }
    >(SIGN_UP, {
      onCompleted: (data) => {
        if (data.signUp) {
          const user: User = {
            id: data.signUp.user.id,
            name: data.signUp.user.name,
            email: data.signUp.user.email,
          }
          this.authContext.login(data.signUp.token, user)
        }
      },
      onError: (error) => {
        console.error('Signup error:', error)
        return error
      },
    })

    return { signupMutation, loading }
  }

  handleSignupError(error: Error, setError: any) {
    if (error.message.includes('Email already in use')) {
      setError('email', { message: 'Este email já está em uso' })
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
    }).catch((error) => viewModel.handleSignupError(error, setError))
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading: loading,
  }
}
