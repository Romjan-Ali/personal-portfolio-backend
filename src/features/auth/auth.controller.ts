// src/features/auth/auth.controller.ts
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { ApiResponse } from '../../utils/api-response'
import { type AuthRequest } from '../../core/middleware/auth.middleware'

const authService = new AuthService()

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(ApiResponse.success('User registered successfully', result))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body)
    res.json(ApiResponse.success('Login successful', result))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(ApiResponse.error('Not authenticated'))
    }

    const user = await authService.getCurrentUser(req.user.id)
    res.json(ApiResponse.success('User data retrieved', user))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}