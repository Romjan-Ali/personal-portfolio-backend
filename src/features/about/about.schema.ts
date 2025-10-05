import { z } from 'zod'

// Stat item schema
const statSchema = z.object({
  number: z.string(),
  label: z.string()
})

// Stats array schema
const statsSchema = z.array(statSchema)

export const createAboutSchema = z.object({
  fullName: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  bio: z.string().min(50).max(2000),
  shortBio: z.string().min(10).max(200).optional().nullable().default(null),
  email: z.string().email().optional().nullable().default(null),
  phone: z.string().optional().nullable().default(null),
  location: z.string().optional().nullable().default(null),
  imageUrl: z.string().url().optional().nullable().default(null),
  resumeUrl: z.string().url().optional().nullable().default(null),
  status: z.string().optional().nullable().default(null),
  stats: statsSchema.optional().nullable().default(null),
})

export const updateAboutSchema = createAboutSchema.partial()

export const aboutParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateAboutInput = z.infer<typeof createAboutSchema>
export type UpdateAboutInput = z.infer<typeof updateAboutSchema>
export type AboutParamsInput = z.infer<typeof aboutParamsSchema>
export type StatItem = z.infer<typeof statSchema>