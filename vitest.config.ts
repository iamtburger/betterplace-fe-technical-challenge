import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: ['./setupTests.ts'],
  },
  plugins: [tsconfigPaths(), react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
