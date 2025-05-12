import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Adicionar configuração de preview para permitir todos os hosts
  preview: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: true,
    allowedHosts: 'all', // Permitir todos os hosts
  },
  // Configuração do servidor de desenvolvimento também
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: true,
    allowedHosts: 'all', // Permitir todos os hosts
  },
})
