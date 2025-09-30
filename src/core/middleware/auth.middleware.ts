// src/core/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../core/config/env'
import { prisma } from '../../core/database/client'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: string
      email: string
      role: string
    }

    interface Request {
      user?: User
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      })
    }
    next()
  }
}

export const requireAdmin = [authenticate, authorize('ADMIN')]

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req)
    if (token) {
      const user = await verifyToken(token)
      req.user = user
    }
    next()
  } catch (error) {
    next()
  }
}

// Helper functions remain the same
const extractToken = (req: Request): string | null => {
  const authHeader = req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.replace('Bearer ', '')
}

const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as any
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}