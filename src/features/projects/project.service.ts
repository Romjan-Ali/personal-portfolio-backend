import { Prisma } from '@prisma/client'
import { prisma } from '../../core/database/client'
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectWithOwner,
} from './types'
import type { ProjectQueryInput } from './project.schema'

export class ProjectService {
  // Get all projects with query support
  async getAllProjects(query?: ProjectQueryInput): Promise<ProjectWithOwner[]> {
    const where: Prisma.ProjectWhereInput = {}

    // Search in title, description, or tags
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ]
    }

    // Single tag filter
    if (query?.tag) {
      where.tags = { has: query.tag }
    }

    // Featured filter
    if (query?.featured !== undefined) {
      where.featured = query.featured === 'true'
    }

    // Owner filter
    if (query?.ownerId) {
      where.ownerId = query.ownerId
    }

    // Pagination
    const page = query?.page ? parseInt(query.page.toString(), 10) : 1
    const limit = query?.limit ? parseInt(query.limit.toString(), 10) : 10
    const skip = (page - 1) * limit

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    })

    return projects as ProjectWithOwner[]
  }

  // Get featured projects
  async getFeaturedProjects(): Promise<ProjectWithOwner[]> {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects as ProjectWithOwner[]
  }

  // Get project by ID
  async getProjectById(id: string): Promise<ProjectWithOwner> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project as ProjectWithOwner
  }

  // Create new project
  async createProject(data: CreateProjectInput): Promise<ProjectWithOwner> {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        tags: data.tags || [],
        featured: data.featured || false,
        ownerId: data.ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    return project as ProjectWithOwner
  }

  // Update project
  async updateProject(
    id: string,
    data: UpdateProjectInput
  ): Promise<ProjectWithOwner> {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      throw new Error('Project not found')
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    return project as ProjectWithOwner
  }

  // Delete project
  async deleteProject(id: string): Promise<{ message: string }> {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      throw new Error('Project not found')
    }

    await prisma.project.delete({
      where: { id },
    })

    return { message: 'Project deleted successfully' }
  }

  // Get projects by tags
  async getProjectsByTags(tags: string[]): Promise<ProjectWithOwner[]> {
    const projects = await prisma.project.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects as ProjectWithOwner[]
  }

  // Search projects
  async searchProjects(query: string): Promise<ProjectWithOwner[]> {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              has: query,
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects as ProjectWithOwner[]
  }
}

export const projectService = new ProjectService()
