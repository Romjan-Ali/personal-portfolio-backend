import type { Skill as PrismaSkill } from '@prisma/client'

export interface Skill extends PrismaSkill {}

export interface CreateSkillInput {
  name: string
  level: number
  category: string
  color?: string | null
  order?: number
}

export interface UpdateSkillInput {
  name?: string
  level?: number
  category?: string
  color?: string | null
  order?: number
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export interface SkillWithCategory extends Skill {
  // Additional fields if needed
}