// src/features/auth/auth.schema.ts
import { z } from 'zod'
import { emailSchema, passwordSchema, nameSchema, urlSchema } from '../../utils/validation.utils'

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
  profileImage: urlSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>