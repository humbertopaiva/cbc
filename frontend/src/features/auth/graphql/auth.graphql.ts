import { gql } from '@apollo/client'

// Mutation para login
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

// Mutation para cadastro
export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

// Query para obter dados do usuário logado
export const ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`
