// src/features/blogs/blog.service.ts
import type { Blog } from '@prisma/client'
import { prisma } from '../../core/database/client'
import { AppError } from '../../core/middleware/error.middleware'
import type {
  CreateBlogInput,
  UpdateBlogInput,
  BlogQuery,
  BlogQueryParams,
} from './types'
import { extractTags } from '../../utils/tags-extractor'
import { getRelatedPosts } from '../../utils/get-related-posts'

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

  // Get blog by ID
  async getBlogById(id: string): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { id },
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
  }

  // Get related posts
  async getRelatedPosts(blogId: string, limit: number = 3): Promise<Blog[]> {
    const currentBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { tags: true },
    })

    if (!currentBlog) {
      return []
    }

    const blogsResult = await this.getAllBlogs({ limit: 100 })
    const blogs = blogsResult.blogs

    const relatedPosts = getRelatedPosts(blogs, blogId, limit)

    return relatedPosts
  }
  
// Get all tags
  async getAllTags(): Promise<string[]> {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: { tags: true }
    })

    const allTags = blogs.flatMap(blog => blog.tags)
    return [...new Set(allTags)].filter(Boolean)
  }
  
  // Get posts by tag
  async getPostsByTag(tag: string): Promise<Blog[]> {
    return prisma.blog.findMany({
      where: {
        published: true,
        tags: { has: tag }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async createBlog(input: CreateBlogInput, authorId: string) {
    const existingSlug = await prisma.blog.findUnique({
      where: { slug: input.slug },
    })

    if (existingSlug) {
      throw new AppError('Slug already exists', 400)
    }

    const tags = extractTags(input.content)

    const blog = await prisma.blog.create({
      data: {
        ...input,
        authorId,
        tags,
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
