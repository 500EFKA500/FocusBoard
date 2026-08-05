import cors from '@fastify/cors'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import seedTasks from './data/seedTasks.js'

export function buildApp({ initialTasks = seedTasks, logger = true } = {}) {
  const app = Fastify({ logger })
  const tasks = structuredClone(initialTasks)

  app.register(cors, {
    origin: 'http://localhost:5173',
  })

  app.get('/health', async () => ({ status: 'ok' }))

  app.get('/api/tasks', async () => tasks)

  app.post('/api/tasks', async (request, reply) => {
    const { title, description = '', status = 'backlog', priority = 'medium' } = request.body ?? {}

    if (typeof title !== 'string' || !title.trim()) {
      return reply.code(400).send({ error: 'Название задачи обязательно.' })
    }

    const newTask = {
      id: randomUUID(),
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      status,
      priority,
    }

    tasks.push(newTask)
    return reply.code(201).send(newTask)
  })

  return app
}