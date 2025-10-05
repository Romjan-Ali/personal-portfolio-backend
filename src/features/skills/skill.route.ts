import { Router } from 'express'
import { skillController } from './skill.controller'
import { requireAdmin } from '../../core/middleware'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../core/middleware/validation.middleware'
import {
  createSkillSchema,
  updateSkillSchema,
  skillParamsSchema,
  skillQuerySchema,
} from './skill.schema'

const router = Router()

// Public routes
router.get('/', validateQuery(skillQuerySchema), skillController.getSkills)
router.get('/categories', skillController.getSkillsByCategory)
router.get('/categories/list', skillController.getSkillCategories)
router.get('/:id', validateParams(skillParamsSchema), skillController.getSkill)

// Protected routes (require authentication)
router.post(
  '/',
  requireAdmin,
  validateBody(createSkillSchema),
  skillController.createSkill
)

router.put(
  '/:id',
  requireAdmin,
  validateParams(skillParamsSchema),
  validateBody(updateSkillSchema),
  skillController.updateSkill
)

router.delete(
  '/:id',
  requireAdmin,
  validateParams(skillParamsSchema),
  skillController.deleteSkill
)

// Bulk operations
router.post('/bulk', requireAdmin, skillController.createManySkills)

router.put('/reorder/:category', requireAdmin, skillController.reorderSkills)

export { router as skillRoutes }
