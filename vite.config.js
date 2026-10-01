import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const DATA_SOURCES = ['mock', 'live']

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Development server defaults to mock data; builds default to the live
  // adapter so production never silently ships mock data.
  const requested = env.VITE_DATA_SOURCE
  const dataSource = DATA_SOURCES.includes(requested)
    ? requested
    : command === 'serve'
      ? 'mock'
      : 'live'

  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Build-time constant: lets the bundler drop the mock adapter from
      // live builds entirely.
      __DATA_SOURCE__: JSON.stringify(dataSource),
    },
  }
})
