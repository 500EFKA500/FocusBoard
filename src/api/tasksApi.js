const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3001/api'

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) {
    return null
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body.error ?? 'Не удалось выполнить запрос к серверу.')
  }

  return body
}

export function fetchTasks() {
  return request('/tasks')
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask(task) {
  return request(`/tasks/${task.id}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
  })
}

export function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, { method: 'DELETE' })
}