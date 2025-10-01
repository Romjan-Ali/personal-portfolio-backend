// src/features/blogs/blog.controller.ts
import type { Request, Response } from 'express'
import { BlogService } from './blog.service'
import { ApiResponse } from '../../utils/api-response'
import { type AuthRequest } from '../../core/middleware/auth.middleware'
import { type BlogQueryInput } from './blog.schema'

const blogService = new BlogService()

export const getBlogs = async (
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response
) => {
  try {
    const { page = 1, limit = 10, search, tag, published } = req.query

    const result = await blogService.getAllBlogs({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search,
      tag,
      published: published ? published === 'true' : undefined,
    })

    res.json(
      ApiResponse.success(
        'Blogs retrieved successfully',
        result.blogs,
        result.pagination
      )
    )
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const getRelatedPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { limit = 3 } = req.query

    if(!id) {
      return res.status(400).json(ApiResponse.error('Blog id is required'))
    }

    const relatedPosts = await blogService.getRelatedPosts(
      id, 
      parseInt(limit as string)
    )

    res.json({
      success: true,
      data: relatedPosts
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related posts'
    })
  }
}

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    if (!slug) {
      return res.status(400).json(ApiResponse.error('Slug is required'))
    }
    const blog = await blogService.getBlogBySlug(slug)
    res.json(ApiResponse.success('Blog retrieved successfully', blog))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blog = await blogService.createBlog(req.body, req.user!.id)
    res.status(201).json(ApiResponse.success('Blog created successfully', blog))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json(ApiResponse.error('Blog id is required'))
    }
    const blog = await blogService.updateBlog(
      id,
      req.body,
      req.user!.id,
      req.user!.role
    )
    res.json(ApiResponse.success('Blog updated successfully', blog))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json(ApiResponse.error('Blog id is required'))
    }
    const result = await blogService.deleteBlog(
      id,
      req.user!.id,
      req.user!.role
    )
    res.json(ApiResponse.success(result.message))
  } catch (error: any) {
    res.status(error.statusCode || 500).json(ApiResponse.error(error.message))
  }
}
