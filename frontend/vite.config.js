import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: command === 'serve' ? {
    proxy: {
      '/api': {
        target: 'https://prepxpert-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
}))
