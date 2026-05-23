import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // La librería loon-core vive en el repo hermano ../LOON (build dist ESM).
      'loon-core': fileURLToPath(new URL('../LOON/dist/index.mjs', import.meta.url)),
    },
  },
  server: {
    // Permitir a Vite leer fuera de la raíz del proyecto (../LOON/dist).
    fs: { allow: ['..'] },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'gsap'
          }
          if (id.includes('node_modules/iconoir-react')) {
            return 'iconoir'
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
