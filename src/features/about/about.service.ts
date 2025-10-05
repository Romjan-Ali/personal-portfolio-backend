import { prisma } from '../../core/database/client'
import type { CreateAboutInput, UpdateAboutInput, About } from './types'
import { parseStats } from './types'

export class AboutService {
  // Get about information (there should only be one record)
  async getAbout(): Promise<About | null> {
    const about = await prisma.about.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!about) return null

    return {
      ...about,
      stats: parseStats(about.stats)
    }
  }

  // Get about by ID
  async getAboutById(id: string): Promise<About> {
    const about = await prisma.about.findUnique({
      where: { id }
    })

    if (!about) {
      throw new Error('About information not found')
    }

    return {
      ...about,
      stats: parseStats(about.stats)
    }
  }

  // Create about information
  async createAbout(data: CreateAboutInput): Promise<About> {
    // Check if about already exists
    const existingAbout = await prisma.about.findFirst()
    if (existingAbout) {
      throw new Error('About information already exists. Use update instead.')
    }

    // Prepare data with proper JSON handling
    const createData: any = {
      fullName: data.fullName,
      title: data.title,
      bio: data.bio,
      shortBio: data.shortBio,
      email: data.email,
      phone: data.phone,
      location: data.location,
      imageUrl: data.imageUrl,
      resumeUrl: data.resumeUrl,
      status: data.status,
    }

    // Handle stats with Prisma.JsonValue type
    if (data.stats) {
      createData.stats = data.stats
    }

    const about = await prisma.about.create({
      data: createData
    })

    return {
      ...about,
      stats: data.stats
    }
  }

  // Update about information
  async updateAbout(id: string, data: UpdateAboutInput): Promise<About> {
    const existingAbout = await prisma.about.findUnique({
      where: { id }
    })

    if (!existingAbout) {
      throw new Error('About information not found')
    }

    const updateData: any = {
      ...data,
      updatedAt: new Date()
    }

    // Handle stats separately to avoid type issues
    if (data.stats !== undefined) {
      updateData.stats = data.stats
    }

    const about = await prisma.about.update({
      where: { id },
      data: updateData
    })

    return {
      ...about,
      stats: data.stats !== undefined ? data.stats : parseStats(about.stats)
    }
  }

  // Update or create about information (upsert)
  async upsertAbout(data: CreateAboutInput): Promise<About> {
    const existingAbout = await prisma.about.findFirst()

    if (existingAbout) {
      return this.updateAbout(existingAbout.id, data)
    } else {
      return this.createAbout(data)
    }
  }

  // Delete about information
  async deleteAbout(id: string): Promise<{ message: string }> {
    const existingAbout = await prisma.about.findUnique({
      where: { id }
    })

    if (!existingAbout) {
      throw new Error('About information not found')
    }

    await prisma.about.delete({
      where: { id }
    })

    return { message: 'About information deleted successfully' }
  }

  // Get public about information (for frontend)
  async getPublicAbout(): Promise<About | null> {
    const about = await this.getAbout()
    
    if (!about) {
      return null
    }

    // Return only public fields if needed
    return about
  }
}

export const aboutService = new AboutService()