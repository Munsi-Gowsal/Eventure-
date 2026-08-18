import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    env: {
      MONGODB_URI: 'mongodb://localhost:27017/test',
      JWT_ACCESS_SECRET: 'test_access_secret_12345678901234567890',
      JWT_REFRESH_SECRET: 'test_refresh_secret_12345678901234567890',
      CLIENT_URL: 'http://localhost:3000',
      CORS_ORIGINS: 'http://localhost:3000',
      NODE_ENV: 'test'
    }
  },
});
