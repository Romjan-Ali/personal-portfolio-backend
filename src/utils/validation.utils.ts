// src/core/utils/validation.utils.ts
import { z } from 'zod'

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
})

// Email validation with proper formatting
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please provide a valid email address')

// Password validation with strength rules
export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters')

// Name validation
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

// URL validation (optional)
export const urlSchema = z.string()
  .url('Please provide a valid URL')
  .optional()
  .or(z.literal(''))

// Array of strings validation
export const stringArraySchema = z.array(z.string()).default([])