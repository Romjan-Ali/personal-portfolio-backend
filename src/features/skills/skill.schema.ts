import { z } from 'zod'

export const createSkillSchema = z.object({
  name: z.string().min(1).max(50),
  level: z.number().min(0).max(100),
  category: z.string().min(1).max(50),
  color: z.string().optional().nullable().default(null),
  order: z.number().int().min(0).default(0),
})

export const updateSkillSchema = createSkillSchema.partial()

export const skillQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.string().optional(),
})

export const skillParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateSkillInput = z.infer<typeof createSkillSchema>
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>
export type SkillQueryInput = z.infer<typeof skillQuerySchema>
export type SkillParamsInput = z.infer<typeof skillParamsSchema>