import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  CORS_ORIGINS: z.string().min(1, 'CORS_ORIGINS is required').transform((val) => val.split(',').map((o) => o.trim())),
}).refine((data) => data.JWT_ACCESS_SECRET !== data.JWT_REFRESH_SECRET, {
  message: 'Access and refresh secrets MUST be different',
  path: ['JWT_REFRESH_SECRET'],
});

const parseEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', error.flatten().fieldErrors);
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
