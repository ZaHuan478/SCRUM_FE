import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || env.VITE_API_URL
  const backendUrl = env.VITE_BACKEND_URL || apiBaseUrl?.replace(/\/api\/?$/, '')
  const proxy = backendUrl
    ? {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
    }
    : undefined

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: proxy
      ? {
        proxy,
      }
      : undefined,
    preview: proxy
      ? {
        proxy,
      }
      : undefined,
  }
})
