// src/features/blogs/blog.service.ts
import { prisma } from '../../core/database/client'
import { AppError } from '../../core/middleware/error.middleware'
import type { CreateBlogInput, UpdateBlogInput, BlogQuery } from './types'

export class BlogService {
  async getAllBlogs(query: BlogQuery) {
    const { page = 1, limit = 10, search, tag, published } = query

    const skip = (page - 1) * limit
    const take = limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (published !== undefined) {
      where.published = published
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      }),
      prisma.blog.count({ where }),
    ])

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    if (!blog) {
      throw new AppError('Blog post not found', 404)
    }

    // Increment views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    })

    return blog
  }

  async createBlog(input: CreateBlogInput, authorId: string) {
    const existingSlug = await prisma.blog.findUnique({
      where: { slug: input.slug },
    })

    if (existingSlug) {
      throw new AppError('Slug already exists', 400)
    }

    const blog = await prisma.blog.create({
      data: {
        ...input,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    return blog
  }

  async updateBlog(
    id: string,
    input: UpdateBlogInput,
    userId: string,
    userRole: string
  ) {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new AppError('Blog post not found', 404)
    }

    // Check ownership or admin role
    if (blog.authorId !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403)
    }

    if (input.slug && input.slug !== blog.slug) {
      const existingSlug = await prisma.blog.findUnique({
        where: { slug: input.slug },
      })

      if (existingSlug) {
        throw new AppError('Slug already exists', 400)
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: input,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    return updatedBlog
  }

  async deleteBlog(id: string, userId: string, userRole: string) {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new AppError('Blog post not found', 404)
    }

    // Check ownership or admin role
    if (blog.authorId !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403)
    }

    await prisma.blog.delete({
      where: { id },
    })

    return { message: 'Blog post deleted successfully' }
  }
}
