import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import env from 'vite-plugin-env-compatible'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  env],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  }
})
