import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: true, // Expose to all network interfaces
    strictPort: true, // Ensure we always use port 3000
  },
  build: {
    outDir: 'dist',
  }
})