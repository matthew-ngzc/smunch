import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import nightwatchPlugin from 'vite-plugin-nightwatch'

const BACKEND = process.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    nightwatchPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': BACKEND
    }
  }
})