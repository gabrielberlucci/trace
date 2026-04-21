import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      lib: path.resolve(__dirname, './lib'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__test__/**/*.test.ts'],
  },
});
