import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ApolloProvider } from '@apollo/client'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/auth.context'
import { ThemeProvider } from '@/features/theme/context/theme.context'
import { apolloClient } from '@/core/lib/apollo'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles.css'
import { Layout } from '@/components/layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

export const Route = createRootRoute({
  component: () => (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Layout>
              <Outlet />
            </Layout>
            <ToastContainer position="top-right" autoClose={3000} />
            <TanStackRouterDevtools />
          </AuthProvider>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ApolloProvider>
  ),
})
