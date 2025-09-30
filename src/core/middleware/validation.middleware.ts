// src/core/middleware/validation.middleware.ts
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

// Use ZodSchema type which covers all schema types in latest Zod
type ZodSchema = z.ZodType<any>

export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      
      // Attach validated data to request for type safety
      ;(req as any).validatedData = result
      next()
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors?.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })) || ['Invalid input'],
      })
    }
  }

// Specific validation helpers for different parts of the request
export const validateBody = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body)
      ;(req as any).validatedBody = result
      next()
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Body validation failed',
        errors: error.errors?.map((err: any) => ({
          field: `body.${err.path.join('.')}`,
          message: err.message,
          code: err.code,
        })) || ['Invalid body'],
      })
    }
  }

export const validateQuery = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query)
      ;(req as any).validatedQuery = result
      next()
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors: error.errors?.map((err: any) => ({
          field: `query.${err.path.join('.')}`,
          message: err.message,
          code: err.code,
        })) || ['Invalid query parameters'],
      })
    }
  }

export const validateParams = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.params)
      ;(req as any).validatedParams = result
      next()
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Parameters validation failed',
        errors: error.errors?.map((err: any) => ({
          field: `params.${err.path.join('.')}`,
          message: err.message,
          code: err.code,
        })) || ['Invalid URL parameters'],
      })
    }
  }

// Safe parse version (doesn't throw, returns result)
export const safeValidate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      })
    }

    ;(req as any).validatedData = result.data
    next()
  }

// Type definitions for validated request data
declare global {
  namespace Express {
    interface Request {
      validatedData?: any
      validatedBody?: any
      validatedQuery?: any
      validatedParams?: any
    }
  }
}