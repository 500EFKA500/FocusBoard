import { buildApp } from './app.js'

const app = buildApp()

try {
  await app.listen({ port: 3001, host: '127.0.0.1' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}