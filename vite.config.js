import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  preview: {
    allowedHosts: ['https://school-management-frontend-rjxe.onrender.com', 'localhost']
  }
})