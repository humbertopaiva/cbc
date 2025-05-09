import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

// URL do nosso backend GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

// Link para tratamento de erros
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      )
    })
  if (networkError) console.error(`[Network error]: ${networkError}`)
})

// Link para adicionar o token de autenticação nos cabeçalhos
const authLink = setContext((_, { headers }) => {
  // Pegar o token de autenticação do localStorage
  const token = localStorage.getItem('auth_token')

  // Retornar os headers com o token se ele existir
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Criar o cliente Apollo com os links configurados
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
