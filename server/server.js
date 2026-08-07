import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildApp } from './app.js'

const serverDirectory = dirname(fileURLToPath(import.meta.url))
const app = buildApp({
  databaseFile: join(serverDirectory, 'data', 'focus-board.db'),
})

try {
  await app.listen({ port: 3001, host: '127.0.0.1' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}