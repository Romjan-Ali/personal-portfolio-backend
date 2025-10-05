import { Router } from 'express'
import { aboutController } from './about.controller'
import { requireAdmin } from '../../core/middleware'
import { validateBody, validateParams } from '../../core/middleware/validation.middleware'
import { createAboutSchema, updateAboutSchema, aboutParamsSchema } from './about.schema'

const router = Router()

// Public routes
router.get('/', aboutController.getAbout)
router.get('/public', aboutController.getPublicAbout)
router.get('/:id', validateParams(aboutParamsSchema), aboutController.getAboutById)

// Protected routes (require authentication)
router.post(
  '/', 
  requireAdmin, 
  validateBody(createAboutSchema), 
  aboutController.createAbout
)

router.put(
  '/:id', 
  requireAdmin, 
  validateParams(aboutParamsSchema),
  validateBody(updateAboutSchema), 
  aboutController.updateAbout
)

router.put(
  '/',
  requireAdmin,
  validateBody(updateAboutSchema),
  aboutController.upsertAbout
)

router.delete(
  '/:id', 
  requireAdmin, 
  validateParams(aboutParamsSchema),
  aboutController.deleteAbout
)

export {router as aboutRoutes}