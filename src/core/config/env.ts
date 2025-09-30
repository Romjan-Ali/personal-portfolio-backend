// src/core/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)