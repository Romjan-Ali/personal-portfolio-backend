// src/features/blogs/blog.routes.ts
import { Router } from 'express'
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getRelatedPosts,
  getPostsByTag,
  getAllTags,
} from './blog.controller'
import { validateBody, validateQuery, requireAdmin } from '../../core/middleware'
import {
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
} from './blog.schema'

const router = Router()

// Public routes
router.get('/', validateQuery(blogQuerySchema), getBlogs)
router.get('/tags', getAllTags)
router.get('/:slug', getBlogBySlug)
router.get('/:id/related', getRelatedPosts)
router.get('/tag/:tag', getPostsByTag)


// Admin-only routes
router.post('/', requireAdmin, validateBody(createBlogSchema), createBlog)
router.put('/:id', requireAdmin, validateBody(updateBlogSchema), updateBlog)
router.delete('/:id', requireAdmin, deleteBlog)

export { router as blogRoutes }