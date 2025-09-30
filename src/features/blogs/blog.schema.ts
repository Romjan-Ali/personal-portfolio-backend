// src/features/blogs/blog.schema.ts
import { z } from 'zod'

export const createBlogSchema = z.object({
  title: z.string().min(5).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(50).max(200),
  content: z.string().min(100),
  published: z.boolean().default(false),
  thumbnail: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).default([]),
})

export const updateBlogSchema = createBlogSchema.partial()

export const blogQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  tag: z.string().optional(),
  published: z.string().optional(),
})

export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>
export type BlogQueryInput = z.infer<typeof blogQuerySchema>