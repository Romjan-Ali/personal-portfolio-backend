import { Router } from 'express'
import { projectController } from './project.controller'
import { requireAdmin } from '../../core/middleware'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../core/middleware/validation.middleware'
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
  projectQuerySchema,
} from './project.schema'

const router = Router()

// Public routes
router.get(
  '/',
  validateQuery(projectQuerySchema),
  projectController.getProjects
)
router.get('/featured', projectController.getFeaturedProjects) // Add featured route
router.get('/search', projectController.searchProjects)
router.get('/tags/:tag', projectController.getProjectsByTag)
router.get(
  '/:id',
  validateParams(projectParamsSchema),
  projectController.getProject
)

// Protected routes (require authentication)
router.post(
  '/',
  requireAdmin,
  validateBody(createProjectSchema),
  projectController.createProject
)

router.put(
  '/:id',
  requireAdmin,
  validateParams(projectParamsSchema),
  validateBody(updateProjectSchema),
  projectController.updateProject
)

router.delete(
  '/:id',
  requireAdmin,
  validateParams(projectParamsSchema),
  projectController.deleteProject
)

export { router as projectRoutes }
