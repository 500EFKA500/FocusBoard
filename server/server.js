import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildApp } from './app.js'

const serverDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = dirname(serverDirectory)
const isProduction = process.env.NODE_ENV === 'production'
const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean)
const app = buildApp({
  databaseFile: process.env.DATABASE_FILE ?? join(serverDirectory, 'data', 'focus-board.db'),
  staticRoot: isProduction ? join(projectDirectory, 'dist') : undefined,
  corsOrigin: corsOrigin?.length ? corsOrigin : ['http://localhost:5173', 'http://127.0.0.1:5173'],
})

try {
  await app.listen({
    port: Number(process.env.PORT ?? 3001),
    host: process.env.HOST ?? (isProduction ? '0.0.0.0' : '127.0.0.1'),
  })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}