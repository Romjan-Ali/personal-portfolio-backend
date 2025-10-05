// src/features/skills/skill.service.ts
import { prisma } from '../../core/database/client'
import type {
  CreateSkillInput,
  UpdateSkillInput,
  SkillCategory,
  Skill,
} from './types'
import type { SkillQueryInput } from './skill.schema'

export class SkillService {
  // Get all skills with optional filtering
  async getAllSkills(query?: SkillQueryInput): Promise<Skill[]> {
    const where: any = {}

    if (query?.category) {
      where.category = query.category
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })

    return skills
  }

  // Get skills grouped by category (for frontend display)
  async getSkillsByCategory(): Promise<SkillCategory[]> {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })

    // Group skills by category with proper typing
    const categoriesMap = skills.reduce(
      (acc: Record<string, Skill[]>, skill) => {
        const category = skill.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(skill)
        return acc
      },
      {}
    )

    // Convert to array format for frontend
    const categories: SkillCategory[] = Object.entries(categoriesMap).map(
      ([title, skills]) => ({
        title,
        skills,
      })
    )

    return categories
  }

  // Get all unique categories
  async getSkillCategories(): Promise<string[]> {
    const categories = await prisma.skill.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    })

    return categories.map((c) => c.category)
  }

  // Get skill by ID
  async getSkillById(id: string): Promise<Skill> {
    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      throw new Error('Skill not found')
    }

    return skill
  }

  // Create new skill
  async createSkill(data: CreateSkillInput): Promise<Skill> {
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        level: data.level,
        category: data.category,
        color: data.color,
        order: data.order || 0,
      },
    })

    return skill
  }

  // Update skill
  async updateSkill(id: string, data: UpdateSkillInput): Promise<Skill> {
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!existingSkill) {
      throw new Error('Skill not found')
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return skill
  }

  // Delete skill
  async deleteSkill(id: string): Promise<{ message: string }> {
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!existingSkill) {
      throw new Error('Skill not found')
    }

    await prisma.skill.delete({
      where: { id },
    })

    return { message: 'Skill deleted successfully' }
  }

  // Bulk create skills (useful for initial setup)
  async createManySkills(
    skills: CreateSkillInput[]
  ): Promise<{ count: number }> {
    const result = await prisma.skill.createMany({
      data: skills,
      skipDuplicates: true,
    })

    return { count: result.count }
  }

  // Reorder skills within a category
  async reorderSkills(category: string, skillIds: string[]): Promise<Skill[]> {
    const updatePromises = skillIds.map((id, index) =>
      prisma.skill.update({
        where: { id },
        data: { order: index },
      })
    )

    const updatedSkills = await Promise.all(updatePromises)
    return updatedSkills
  }
}

export const skillService = new SkillService()
