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

export interface Blog {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  published: boolean
  views: number
  thumbnail?: string
  images: string[]
  tags: string[]
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface BlogCreateInput {
  title: string
  slug: string
  summary: string
  content: string
  published?: boolean
  thumbnail?: string
  images?: string[]
  tags?: string[]
  authorId: string
}

export interface BlogUpdateInput {
  title?: string
  slug?: string
  summary?: string
  content?: string
  published?: boolean
  thumbnail?: string
  images?: string[]
  tags?: string[]
}

export interface BlogQueryParams {
  featured?: boolean
  limit?: number
  tag?: string
  published?: boolean
  page?: number
  search?: string
}

export interface BlogResponse {
  success: boolean
  data?: Blog | Blog[]
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
