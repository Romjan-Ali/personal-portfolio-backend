import { type Project as PrismaProject } from '@prisma/client'

export interface Project extends PrismaProject {}

export interface CreateProjectInput {
  title: string
  description: string
  image?: string | null
  liveUrl?: string | null
  repoUrl?: string | null
  tags?: string[]
  featured?: boolean
  ownerId?: string
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  image?: string | null
  liveUrl?: string | null
  repoUrl?: string | null
  tags?: string[]
  featured?: boolean
}

export interface ProjectFilters {
  featured?: boolean
  ownerId?: string
  tags?: string[]
}

export interface ProjectWithOwner extends Project {
  owner?: {
    id: string
    name: string | null
    email: string
    profileImage: string | null
  }
}