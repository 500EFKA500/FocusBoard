import cors from '@fastify/cors'
import Fastify from 'fastify'
import { createTaskRepository } from './db.js'

const allowedStatuses = new Set(['backlog', 'in-progress', 'review', 'done'])
const allowedPriorities = new Set(['low', 'medium', 'high'])

function validateTaskPayload(payload, { partial = false } = {}) {
  const data = payload ?? {}
  const errors = []
  const task = {}

  if (!partial || 'title' in data) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      errors.push('Название задачи обязательно.')
    } else {
      task.title = data.title.trim()
    }
  }

  if (!partial || 'description' in data) {
    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push('Описание должно быть строкой.')
    } else {
      task.description = data.description?.trim() ?? ''
    }
  }

  if (!partial || 'status' in data) {
    const status = data.status ?? 'backlog'
    if (!allowedStatuses.has(status)) {
      errors.push('Передан неизвестный статус задачи.')
    } else {
      task.status = status
    }
  }

  if (!partial || 'priority' in data) {
    const priority = data.priority ?? 'medium'
    if (!allowedPriorities.has(priority)) {
      errors.push('Передан неизвестный приоритет задачи.')
    } else {
      task.priority = priority
    }
  }

  return errors.length > 0 ? { errors } : { task }
}

export function buildApp({ databaseFile, initialTasks, logger = true, repository } = {}) {
  const app = Fastify({ logger })
  const taskRepository = repository ?? createTaskRepository({ filename: databaseFile, initialTasks })
  const ownsRepository = !repository

  app.register(cors, {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  })

  app.addHook('onClose', async () => {
    if (ownsRepository) {
      taskRepository.close()
    }
  })

  app.get('/health', async () => ({ status: 'ok' }))

  app.get('/api/tasks', async () => taskRepository.findAll())

  app.post('/api/tasks', async (request, reply) => {
    const result = validateTaskPayload(request.body)

    if (result.errors) {
      return reply.code(400).send({ error: result.errors.join(' ') })
    }

    return reply.code(201).send(taskRepository.create(result.task))
  })

  app.patch('/api/tasks/:id', async (request, reply) => {
    const currentTask = taskRepository.findById(request.params.id)

    if (!currentTask) {
      return reply.code(404).send({ error: 'Задача не найдена.' })
    }

    const result = validateTaskPayload(request.body, { partial: true })

    if (result.errors) {
      return reply.code(400).send({ error: result.errors.join(' ') })
    }

    return taskRepository.update({ ...currentTask, ...result.task })
  })

  app.delete('/api/tasks/:id', async (request, reply) => {
    const wasDeleted = taskRepository.delete(request.params.id)

    if (!wasDeleted) {
      return reply.code(404).send({ error: 'Задача не найдена.' })
    }

    return reply.code(204).send()
  })

  return app
}