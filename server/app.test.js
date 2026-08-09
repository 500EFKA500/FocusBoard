// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { buildApp } from './app.js'

const apps = []

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()))
})

function createApp() {
  const app = buildApp({ logger: false })
  apps.push(app)
  return app
}

describe('task API', () => {
  it('returns a health response and seed tasks', async () => {
    const app = createApp()
    const health = await app.inject({ method: 'GET', url: '/health' })
    const tasks = await app.inject({ method: 'GET', url: '/api/tasks' })

    expect(health.statusCode).toBe(200)
    expect(health.json()).toEqual({ status: 'ok' })
    expect(tasks.statusCode).toBe(200)
    expect(tasks.json()).toHaveLength(2)
  })

  it('creates, updates and removes a task', async () => {
    const app = createApp()
    const created = await app.inject({ method: 'POST', url: '/api/tasks', payload: { title: 'Проверить API', priority: 'high' } })
    const taskId = created.json().id
    const updated = await app.inject({ method: 'PATCH', url: `/api/tasks/${taskId}`, payload: { status: 'done' } })
    const removed = await app.inject({ method: 'DELETE', url: `/api/tasks/${taskId}` })

    expect(created.statusCode).toBe(201)
    expect(updated.json().status).toBe('done')
    expect(removed.statusCode).toBe(204)
  })

  it('rejects a task without a title', async () => {
    const app = createApp()
    const response = await app.inject({ method: 'POST', url: '/api/tasks', payload: { title: ' ' } })

    expect(response.statusCode).toBe(400)
    expect(response.json().error).toContain('Название')
  })
})