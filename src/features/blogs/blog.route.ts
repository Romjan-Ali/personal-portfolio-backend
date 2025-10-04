// src/features/blogs/blog.routes.ts
import { Router } from 'express'
import {
  getBlogs,
  getAllTags,
  getTotalViews,
  getRelatedPosts,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlogById,
} from './blog.controller'
import {
  validateBody,
  validateQuery,
  requireAdmin,
} from '../../core/middleware'
import {
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
} from './blog.schema'

const router = Router()
  
// Public routes
router.get('/', getBlogs)
router.get('/tags', getAllTags)
router.get('/total-views', getTotalViews)
router.get('/:id/related', getRelatedPosts)
router.get('/:slug', getBlogBySlug)

// Admin-only routes
router.post('/', requireAdmin, validateBody(createBlogSchema), createBlog)
router.put('/:id', requireAdmin, validateBody(updateBlogSchema), updateBlog)
router.delete('/:id', requireAdmin, deleteBlogById)

export { router as blogRoutes }
