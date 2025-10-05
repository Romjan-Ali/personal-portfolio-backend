import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(50).max(1000),
  image: z.string().url().optional().or(z.literal('')).nullable().default(null),
  liveUrl: z.string().url().optional().or(z.literal('')).nullable().default(null),
  repoUrl: z.string().url().optional().or(z.literal('')).nullable().default(null),
  tags: z.array(z.string().min(1).max(20)).default([]),
  featured: z.boolean().default(false),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  tag: z.string().optional(),
  featured: z.string().optional(), // Add featured filter
  ownerId: z.string().optional(),
})

export const projectParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>
export type ProjectParamsInput = z.infer<typeof projectParamsSchema>