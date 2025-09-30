// src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './core/config/env'
import { errorHandler } from './core/middleware/error.middleware'

// Import feature routes
import { authRoutes } from './features/auth/auth.routes'
import { blogRoutes } from './features/blogs/blog.route' 
// import { projectRoutes } from './features/projects/project.routes'
// import { skillRoutes } from './features/skills/skill.routes'
// import { aboutRoutes } from './features/about/about.routes'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  })
})

// Feature routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
// app.use('/api/projects', projectRoutes)
// app.use('/api/skills', skillRoutes)
// app.use('/api/about', aboutRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler
app.use(errorHandler)

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${env.NODE_ENV}`)
  console.log(`🔗 CORS Origin: ${env.CORS_ORIGIN}`)
  console.log(`🏗️  Features: Auth, Blogs, Projects, Skills, About`)
})

export default app