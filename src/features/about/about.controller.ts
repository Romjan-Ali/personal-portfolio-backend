import type { Request, Response } from 'express'
import { aboutService } from './about.service'
import type { AboutResponse } from './types'

// Extend Express Request type to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedParams?: { id: string } | any
    }
  }
}


export class AboutController {
  // GET /api/about
  async getAbout(req: Request, res: Response) {
    try {
      const about = await aboutService.getAbout()
      
      const response: AboutResponse = {
        success: true,
        data: about || undefined
      }

      res.json(response)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // GET /api/about/public
  async getPublicAbout(req: Request, res: Response) {
    try {
      const about = await aboutService.getPublicAbout()
      
      const response: AboutResponse = {
        success: true,
        data: about || undefined
      }

      res.json(response)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch public about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // GET /api/about/:id
  async getAboutById(req: Request, res: Response) {
    try {
      // Use validated params from middleware
      const id = req.validatedParams?.id || req.params.id
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'About ID is required'
        })
      }

      const about = await aboutService.getAboutById(id)
      
      const response: AboutResponse = {
        success: true,
        data: about
      }

      res.json(response)
    } catch (error) {
      if (error instanceof Error && error.message === 'About information not found') {
        return res.status(404).json({
          success: false,
          message: 'About information not found'
        })
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // POST /api/about
  async createAbout(req: Request, res: Response) {
    try {
      const aboutData = req.body
      const about = await aboutService.createAbout(aboutData)
      
      const response: AboutResponse = {
        success: true,
        message: 'About information created successfully',
        data: about
      }

      res.status(201).json(response)
    } catch (error) {
      if (error instanceof Error && error.message === 'About information already exists. Use update instead.') {
        return res.status(409).json({
          success: false,
          message: 'About information already exists. Use update instead.'
        })
      }
      
      res.status(400).json({
        success: false,
        message: 'Failed to create about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // PUT /api/about/:id
  async updateAbout(req: Request, res: Response) {
    try {
      // Use validated params from middleware
      const id = req.validatedParams?.id || req.params.id
      const aboutData = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'About ID is required'
        })
      }

      const about = await aboutService.updateAbout(id, aboutData)
      
      const response: AboutResponse = {
        success: true,
        message: 'About information updated successfully',
        data: about
      }

      res.json(response)
    } catch (error) {
      if (error instanceof Error && error.message === 'About information not found') {
        return res.status(404).json({
          success: false,
          message: 'About information not found'
        })
      }
      
      res.status(400).json({
        success: false,
        message: 'Failed to update about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // PUT /api/about
  async upsertAbout(req: Request, res: Response) {
    try {
      const aboutData = req.body
      const about = await aboutService.upsertAbout(aboutData)
      
      const message = about.createdAt.getTime() === about.updatedAt.getTime() ? 
        'About information created successfully' : 
        'About information updated successfully'

      const response: AboutResponse = {
        success: true,
        message,
        data: about
      }

      res.json(response)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // DELETE /api/about/:id
  async deleteAbout(req: Request, res: Response) {
    try {
      // Use validated params from middleware
      const id = req.validatedParams?.id || req.params.id

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'About ID is required'
        })
      }

      const result = await aboutService.deleteAbout(id)
      
      res.json({
        success: true,
        message: result.message
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'About information not found') {
        return res.status(404).json({
          success: false,
          message: 'About information not found'
        })
      }
      
      res.status(400).json({
        success: false,
        message: 'Failed to delete about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const aboutController = new AboutController()