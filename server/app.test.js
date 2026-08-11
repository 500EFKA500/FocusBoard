import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { buildApp } from './app.js'

const initialTasks = [
  { id: 'task-1', title: 'Первая задача', description: 'Проверить API', status: 'backlog', priority: 'medium' },
]

const apps = []
const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()))
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

function createApp() {
  const app = buildApp({ initialTasks, logger: false })
  apps.push(app)
  return app
}

describe('task API', () => {
  it('returns a health response and seed tasks', async () => {
    const app = createApp()

    const healthResponse = await app.inject({ method: 'GET', url: '/health' })
    const tasksResponse = await app.inject({ method: 'GET', url: '/api/tasks' })

    expect(healthResponse.json()).toEqual({ status: 'ok' })
    expect(tasksResponse.json()).toEqual(initialTasks)
  })

  it('creates, updates and removes a task', async () => {
    const app = createApp()
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Новая задача', description: 'Сделать тест', status: 'backlog', priority: 'high' },
    })
    const createdTask = createResponse.json()

    expect(createResponse.statusCode).toBe(201)

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${createdTask.id}`,
      payload: { status: 'done' },
    })
    const deleteResponse = await app.inject({ method: 'DELETE', url: `/api/tasks/${createdTask.id}` })

    expect(updateResponse.json()).toMatchObject({ id: createdTask.id, status: 'done' })
    expect(deleteResponse.statusCode).toBe(204)
  })

  it('rejects a task without a title', async () => {
    const app = createApp()
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: '   ' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().error).toContain('Название задачи')
  })

  it('serves the built frontend and keeps client routes working in production mode', async () => {
    const staticRoot = await mkdtemp(join(tmpdir(), 'focus-board-static-'))
    temporaryDirectories.push(staticRoot)
    await writeFile(join(staticRoot, 'index.html'), '<main>FocusBoard</main>')
    await writeFile(join(staticRoot, 'app.js'), 'console.log("FocusBoard")')
    const app = buildApp({ initialTasks, logger: false, staticRoot })
    apps.push(app)

    const rootResponse = await app.inject({ method: 'GET', url: '/' })
    const assetResponse = await app.inject({ method: 'GET', url: '/app.js' })
    const clientRouteResponse = await app.inject({ method: 'GET', url: '/settings' })

    expect(rootResponse.headers['content-type']).toContain('text/html')
    expect(rootResponse.body).toContain('FocusBoard')
    expect(assetResponse.headers['content-type']).toContain('text/javascript')
    expect(clientRouteResponse.body).toContain('FocusBoard')
  })
})