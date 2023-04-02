import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
})
