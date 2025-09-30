// src/features/blogs/types/index.ts
export interface CreateBlogInput {
  title: string
  slug: string
  summary: string
  content: string
  published?: boolean
  thumbnail?: string
  images?: string[]
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {}

export interface BlogQuery {
  page?: number
  limit?: number
  search?: string
  tag?: string
  published?: boolean
}