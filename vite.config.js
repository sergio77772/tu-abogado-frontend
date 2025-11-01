import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://tuabogadoenlinea.free.nf/apis',
        changeOrigin: true,
        rewrite: (path) => path, // Mantener /api/ en la ruta para que vaya a /apis/api/...
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
