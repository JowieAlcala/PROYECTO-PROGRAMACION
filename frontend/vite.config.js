// frontend/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: '.',        // assegura que Vite busqui index.html aquí
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // qualsevol GET/POST a /api/... es proxy al backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,  // no modifiquem el camí
      }
    }
  }
});
