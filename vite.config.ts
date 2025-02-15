import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/news_app_frontend/',  // Repository name
  build: {
    outDir: './docs',
    emptyOutDir: true
  }
})
