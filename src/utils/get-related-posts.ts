import type { Blog } from "@prisma/client"
import { extractTags } from "./tags-extractor"

/**
 * Get related posts based on tags, title similarity, and content
 */
export function getRelatedPosts(
  posts: Blog[],
  currentPostId: string,
  limit: number = 3
): Blog[] {
  if (!posts.length || !currentPostId) {
    return []
  }

  const currentPost = posts.find((post) => post.id === currentPostId)
  if (!currentPost) {
    return []
  }

  // Calculate similarity scores for all other posts
  const postsWithScores = posts
    .filter((post) => post.id !== currentPostId && post.published)
    .map((post) => ({
      post,
      score: calculatePostSimilarity(currentPost, post),
    }))
    .filter((item) => item.score > 0) // Only include posts with some similarity
    .sort((a, b) => b.score - a.score) // Sort by highest similarity first
    .slice(0, limit) // Take top N posts
    .map((item) => item.post)

  // If we don't have enough similar posts, fill with recent posts
  if (postsWithScores.length < limit) {
    const recentPosts = getRecentPosts(
      posts,
      currentPostId,
      limit - postsWithScores.length
    )
    const uniqueRecentPosts = recentPosts.filter(
      (recentPost) => !postsWithScores.some((post) => post.id === recentPost.id)
    )
    postsWithScores.push(...uniqueRecentPosts)
  }

  return postsWithScores
}

/**
 * Calculate similarity between two posts based on tags, title, and content
 */
function calculatePostSimilarity(postA: Blog, postB: Blog): number {
  let score = 0

  // 1. Tag similarity (40% weight)
  const tagsA = extractTags(postA.content)
  const tagsB = extractTags(postB.content)
  const commonTags = tagsA.filter((tag) => tagsB.includes(tag))
  score += (commonTags.length / Math.max(tagsA.length, tagsB.length)) * 0.4

  // 2. Title similarity (30% weight)
  const titleSimilarity = calculateTextSimilarity(postA.title, postB.title)
  score += titleSimilarity * 0.3

  // 3. Content keyword similarity (30% weight)
  const contentSimilarity = calculateTextSimilarity(
    getContentKeywords(postA.content),
    getContentKeywords(postB.content)
  )
  score += contentSimilarity * 0.3

  return score
}

/**
 * Calculate text similarity using simple word overlap
 */
function calculateTextSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0

  const wordsA = new Set(
    textA
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3) // Only consider words longer than 3 chars
  )

  const wordsB = new Set(
    textB
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3)
  )

  if (wordsA.size === 0 || wordsB.size === 0) return 0

  const commonWords = [...wordsA].filter((word) => wordsB.has(word))
  return commonWords.length / Math.max(wordsA.size, wordsB.size)
}

/**
 * Extract keywords from content for similarity comparison
 */
function getContentKeywords(content: string): string {
  if (!content) return ''

  // Remove code blocks, markdown, and get the first few paragraphs
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*\-_~>]/g, '')
    .split('\n')
    .slice(0, 5) // Take first 5 lines
    .join(' ')
    .trim()
}

/**
 * Get recent posts (fallback for related posts)
 */
function getRecentPosts(
  posts: Blog[],
  excludePostId: string,
  limit: number
): Blog[] {
  return posts
    .filter((post) => post.id !== excludePostId && post.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit)
}
