import type { Blog } from "@prisma/client"

/**
 * Extract relevant tags from blog post content
 * @param content - The blog post content
 * @param maxTags - Maximum number of tags to extract (default: 3)
 * @returns Array of tags
 */
export function extractTags(content: string, maxTags: number = 3): string[] {
  if (!content || typeof content !== 'string') {
    return ['General']
  }

  // Common technology and programming tags
  const commonTags = [
    // Frontend
    'React',
    'Vue',
    'Angular',
    'Svelte',
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'Tailwind',
    'Bootstrap',
    'Next.js',
    'Nuxt.js',
    'Gatsby',
    'SASS',
    'SCSS',

    // Backend
    'Node.js',
    'Express',
    'NestJS',
    'Python',
    'Django',
    'Flask',
    'Ruby',
    'Rails',
    'PHP',
    'Laravel',
    'Java',
    'Spring',
    'C#',
    'ASP.NET',
    'Go',
    'Rust',

    // Database
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'SQLite',
    'Firebase',
    'Supabase',

    // DevOps & Tools
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Git',
    'GitHub',
    'CI/CD',
    'Webpack',
    'Vite',
    'Jest',
    'Testing',
    'DevOps',

    // Concepts
    'Performance',
    'Optimization',
    'Security',
    'Authentication',
    'Authorization',
    'REST',
    'GraphQL',
    'API',
    'Microservices',
    'Serverless',
    'PWA',
    'Responsive Design',
    'Accessibility',
    'SEO',
    'UX',
    'UI',

    // Programming Concepts
    'Algorithms',
    'Data Structures',
    'Design Patterns',
    'Clean Code',
    'Best Practices',
    'Tutorial',
    'Guide',
    'Beginner',
    'Advanced',

    // General
    'Web Development',
    'Mobile Development',
    'Full Stack',
    'Frontend',
    'Backend',
  ]

  const contentLower = content.toLowerCase()
  const foundTags: string[] = []

  // Find tags that appear in the content
  for (const tag of commonTags) {
    if (foundTags.length >= maxTags) break

    const tagLower = tag.toLowerCase()

    // Check if tag appears in content (as whole word for better accuracy)
    const regex = new RegExp(`\\b${tagLower}\\b`, 'i')
    if (regex.test(contentLower)) {
      foundTags.push(tag)
    }
  }

  // If no specific tags found, return some general ones based on content analysis
  if (foundTags.length === 0) {
    return getFallbackTags(content, maxTags)
  }

  return foundTags
}

/**
 * Get fallback tags when no specific tags are found
 */
function getFallbackTags(content: string, maxTags: number): string[] {
  const fallbackTags: string[] = []
  const contentLower = content.toLowerCase()

  // Check for programming languages
  const languageKeywords = {
    JavaScript: ['javascript', 'js ', 'es6', 'ecmascript'],
    TypeScript: ['typescript', 'ts '],
    Python: ['python', 'py '],
    React: ['react', 'jsx', 'hooks'],
    'Node.js': ['node', 'nodejs'],
    CSS: ['css', 'stylesheet', 'styling'],
    HTML: ['html', 'markup'],
  }

  for (const [tag, keywords] of Object.entries(languageKeywords)) {
    if (fallbackTags.length >= maxTags) break
    if (keywords.some((keyword) => contentLower.includes(keyword))) {
      fallbackTags.push(tag)
    }
  }

  // Check for content type
  if (fallbackTags.length < maxTags) {
    if (
      contentLower.includes('tutorial') ||
      contentLower.includes('guide') ||
      contentLower.includes('step by step')
    ) {
      fallbackTags.push('Tutorial')
    } else if (
      contentLower.includes('best practice') ||
      contentLower.includes('tips')
    ) {
      fallbackTags.push('Best Practices')
    } else if (
      contentLower.includes('performance') ||
      contentLower.includes('optimization')
    ) {
      fallbackTags.push('Performance')
    }
  }

  // Add general tags if still needed
  while (fallbackTags.length < maxTags) {
    const generalTags = ['Web Development', 'Programming', 'Technology']
    const nextTag = generalTags[fallbackTags.length % generalTags.length]
    if (typeof nextTag === 'string' && !fallbackTags.includes(nextTag)) {
      fallbackTags.push(nextTag)
    }
  }

  return fallbackTags.slice(0, maxTags)
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(posts: Blog[]): string[] {
  const allTags = posts
    .filter(post => post.published)
    .flatMap(post => extractTags(post.content))
  
  const uniqueTags = [...new Set(allTags)]
  return uniqueTags.sort()
}