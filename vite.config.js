import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acessos externos
    port: 5173,      // Porta na qual o servidor será executado
    strictPort: true // Garante que a porta será a especificada
  },
})
