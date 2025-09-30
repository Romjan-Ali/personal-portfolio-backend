// src/features/auth/auth.routes.ts
import { Router } from 'express'
import { register, login, getMe } from './auth.controller'
import { validateBody } from '../../core/middleware'
import { authenticate } from '../../core/middleware'
import { createUserSchema, loginSchema } from './auth.schema'

const router = Router()

router.post('/register', validateBody(createUserSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.get('/me', authenticate, getMe)

export { router as authRoutes }