import app from './app'
import { env } from './core/config/env'
import { Server } from 'http'

const PORT = env.PORT || 7000

let server: Server

;(async () => {
    server = app.listen(env.PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📊 Environment: ${env.NODE_ENV}`)
    console.log(`🔗 CORS Origin: ${env.CORS_ORIGIN}`)
    console.log(`🏗️  Features: Auth, Blogs, Projects, Skills, About`)
  })
})()

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log('Uncaught Exception signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local error")
