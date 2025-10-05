import type { Request, Response } from 'express'
import { skillService } from './skill.service'
import type { SkillQueryInput } from './skill.schema'
import { ApiResponse } from '../../utils/api-response'

export class SkillController {
  // GET /api/skills
  async getSkills(req: Request, res: Response) {
    try {
      const query = req.query as SkillQueryInput
      const skills = await skillService.getAllSkills(query)

      res.json({
        success: true,
        data: skills,
        count: skills.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch skills',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/skills/categories
  async getSkillsByCategory(req: Request, res: Response) {
    try {
      const categories = await skillService.getSkillsByCategory()

      res.json({
        success: true,
        data: categories,
        count: categories.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch skills by category',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/skills/categories/list
  async getSkillCategories(req: Request, res: Response) {
    try {
      const categories = await skillService.getSkillCategories()

      res.json({
        success: true,
        data: categories,
        count: categories.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch skill categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/skills/:id
  async getSkill(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json(ApiResponse.error('Skill id is required'))
      }

      const skill = await skillService.getSkillById(id)

      res.json({
        success: true,
        data: skill,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Skill not found') {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch skill',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // POST /api/skills
  async createSkill(req: Request, res: Response) {
    try {
      const skillData = req.body
      const skill = await skillService.createSkill(skillData)

      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: skill,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create skill',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // PUT /api/skills/:id
  async updateSkill(req: Request, res: Response) {
    try {
      const { id } = req.params
      const skillData = req.body

      if (!id) {
        return res.status(400).json(ApiResponse.error('Skill id is required'))
      }

      const skill = await skillService.updateSkill(id, skillData)

      res.json({
        success: true,
        message: 'Skill updated successfully',
        data: skill,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Skill not found') {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      res.status(400).json({
        success: false,
        message: 'Failed to update skill',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // DELETE /api/skills/:id
  async deleteSkill(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json(ApiResponse.error('Skill id is required'))
      }

      const result = await skillService.deleteSkill(id)

      res.json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Skill not found') {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      res.status(400).json({
        success: false,
        message: 'Failed to delete skill',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // POST /api/skills/bulk
  async createManySkills(req: Request, res: Response) {
    try {
      const { skills } = req.body

      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array',
        })
      }

      const result = await skillService.createManySkills(skills)

      res.status(201).json({
        success: true,
        message: 'Skills created successfully',
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create skills',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // PUT /api/skills/reorder/:category
  async reorderSkills(req: Request, res: Response) {
    try {
      const { category } = req.params
      const { skillIds } = req.body

      if (!Array.isArray(skillIds)) {
        return res.status(400).json({
          success: false,
          message: 'skillIds must be an array',
        })
      }

      if (!category) {
        return res.status(400).json(ApiResponse.error('Category is required'))
      }

      const skills = await skillService.reorderSkills(category, skillIds)

      res.json({
        success: true,
        message: 'Skills reordered successfully',
        data: skills,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to reorder skills',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

export const skillController = new SkillController()
