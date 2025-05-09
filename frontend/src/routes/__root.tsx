import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ApolloProvider } from '@apollo/client'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '@/features/auth/context/auth.context'
import { ThemeProvider } from '@/features/theme/context/theme.context'
import { apolloClient } from '@/core/lib/apollo'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles.css'

export const Route = createRootRoute({
  component: () => (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <ToastContainer position="top-right" autoClose={3000} />
          <TanStackRouterDevtools />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ),
})
