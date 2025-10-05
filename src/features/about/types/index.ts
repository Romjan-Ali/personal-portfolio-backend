import type { About as PrismaAbout } from '@prisma/client'
import type { StatItem } from '../about.schema'

// Use Prisma.JsonValue type properly
export type JsonValue = import('@prisma/client').Prisma.JsonValue

// Extend the Prisma About type to handle JSON stats properly
export interface About extends Omit<PrismaAbout, 'stats'> {
  stats?: StatItem[] | null
}

export interface CreateAboutInput {
  fullName: string
  title: string
  bio: string
  shortBio?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  imageUrl?: string | null
  resumeUrl?: string | null
  status?: string | null
  stats?: StatItem[] | null
}

export interface UpdateAboutInput {
  fullName?: string
  title?: string
  bio?: string
  shortBio?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  imageUrl?: string | null
  resumeUrl?: string | null
  status?: string | null
  stats?: StatItem[] | null
}

export interface AboutResponse {
  success: boolean
  data?: About
  message?: string
}

// Helper function to safely parse JSON stats
export const parseStats = (stats: JsonValue | null): StatItem[] | null => {
  if (!stats) return null
  if (typeof stats === 'string') {
    try {
      return JSON.parse(stats)
    } catch {
      return null
    }
  }
  return stats as StatItem[]
}

