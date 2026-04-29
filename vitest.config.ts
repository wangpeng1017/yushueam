import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/*.spec.ts'],
    setupFiles: [],
  },
  resolve: {
    alias: [
      {
        find: /\@\//,
        replacement: `${resolve(__dirname, 'src')}/`,
      },
    ],
  },
})
