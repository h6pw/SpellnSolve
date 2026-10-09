import { defineConfig } from 'vitest/config';
export default defineConfig({ test: {
  include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
  reporters: ['default', 'junit'], outputFile: { junit: 'reports/junit.xml' },
  coverage: { provider: 'v8', include: ['src/core/**/*.js'], reportsDirectory: 'reports/coverage',
    reporter: ['text', 'html', 'lcov', 'json-summary'],
    thresholds: { lines: 70, statements: 70, functions: 70, branches: 70 } }
} });
