import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  const env = loadEnv('development', process.cwd(), '')

  return {
    plugins: [tsconfigPaths(), react()],
    test: {
      environment: 'jsdom',
      env: { ...env },
    },
  }
})
