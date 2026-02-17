import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
       "@": path.resolve(__dirname, "./src"), // ✅ REQUIRED FOR SHADCN

      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@services': path.resolve(__dirname, './src/services'),
      'components': path.resolve(__dirname, './src/components'),

    }
  }
})