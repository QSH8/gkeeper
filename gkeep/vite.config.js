import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api/index.js', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services/index.js', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils/index.js', import.meta.url)),
    },
  },
})
