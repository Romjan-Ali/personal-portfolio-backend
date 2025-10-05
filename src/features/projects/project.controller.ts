import type { Request, Response } from 'express'
import { projectService } from './project.service'
import type { ProjectQueryInput } from './project.schema'
import { ApiResponse } from '../../utils/api-response'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

export class ProjectController {
  // GET /api/projects
  async getProjects(req: Request, res: Response) {
    try {
      const query = req.query as ProjectQueryInput
      const projects = await projectService.getAllProjects(query)

      res.json({
        success: true,
        data: projects,
        count: projects.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/projects/featured
  async getFeaturedProjects(req: Request, res: Response) {
    try {
      const projects = await projectService.getFeaturedProjects()

      res.json({
        success: true,
        data: projects,
        count: projects.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured projects',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/projects/:id
  async getProject(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json(ApiResponse.error('Project id is required'))
      }

      const project = await projectService.getProjectById(id)

      res.json({
        success: true,
        data: project,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        })
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // POST /api/projects
  async createProject(req: Request, res: Response) {
    try {
      const projectData = req.body

      if (req.user) {
        projectData.ownerId = req.user.id
      }

      const project = await projectService.createProject(projectData)

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // PUT /api/projects/:id
  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const projectData = req.body

      if (!id) {
        return res.status(400).json(ApiResponse.error('Project id is required'))
      }

      const project = await projectService.updateProject(id, projectData)

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        })
      }

      res.status(400).json({
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // DELETE /api/projects/:id
  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json(ApiResponse.error('Project id is required'))
      }

      const result = await projectService.deleteProject(id)

      res.json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        })
      }

      res.status(400).json({
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/projects/search
  async searchProjects(req: Request, res: Response) {
    try {
      const { q } = req.query

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        })
      }

      const projects = await projectService.searchProjects(q)

      res.json({
        success: true,
        data: projects,
        count: projects.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search projects',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // GET /api/projects/tags/:tag
  async getProjectsByTag(req: Request, res: Response) {
    try {
      const { tag } = req.params

      if (!tag) {
        return res.status(400).json({
          success: false,
          message: 'Tag is required',
        })
      }

      const projects = await projectService.getProjectsByTags([tag])

      res.json({
        success: true,
        data: projects,
        count: projects.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects by tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

export const projectController = new ProjectController()
