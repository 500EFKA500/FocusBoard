import { useCallback, useEffect, useMemo, useState } from 'react'
import { createTask as createTaskRequest, deleteTask as deleteTaskRequest, fetchTasks, updateTask as updateTaskRequest } from '../api/tasksApi.js'
import useLocalStorage from './useLocalStorage.js'

const initialFilters = {
  query: '',
  priority: 'all',
}

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

function toErrorMessage(error) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка.'
}

function createDemoTask(draft) {
  return {
    ...draft,
    id: globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }
}

export default function useTasks(initialTasks) {
  const [tasks, setTasks] = useLocalStorage('focus-board-tasks', initialTasks)
  const [filters, setFilters] = useState(initialFilters)
  const [isLoading, setIsLoading] = useState(!isDemoMode)
  const [error, setError] = useState(null)

  const reloadTasks = useCallback(async () => {
    if (isDemoMode) {
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const serverTasks = await fetchTasks()
      setTasks(serverTasks)
    } catch (requestError) {
      setError(toErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [setTasks])

  useEffect(() => {
    reloadTasks()
  }, [reloadTasks])

  const visibleTasks = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesQuery =
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery)
      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority

      return matchesQuery && matchesPriority
    })
  }, [filters, tasks])

  async function createTask(draft) {
    setError(null)

    if (isDemoMode) {
      const newTask = createDemoTask(draft)
      setTasks((currentTasks) => [newTask, ...currentTasks])
      return newTask
    }

    try {
      const newTask = await createTaskRequest(draft)
      setTasks((currentTasks) => [newTask, ...currentTasks])
      return newTask
    } catch (requestError) {
      setError(toErrorMessage(requestError))
      return null
    }
  }

  async function deleteTask(taskId) {
    setError(null)

    if (isDemoMode) {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
      return true
    }

    try {
      await deleteTaskRequest(taskId)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
      return true
    } catch (requestError) {
      setError(toErrorMessage(requestError))
      return false
    }
  }

  async function updateTask(updatedTask) {
    setError(null)

    if (isDemoMode) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => task.id === updatedTask.id ? updatedTask : task),
      )
      return updatedTask
    }

    try {
      const savedTask = await updateTaskRequest(updatedTask)
      setTasks((currentTasks) =>
        currentTasks.map((task) => task.id === savedTask.id ? savedTask : task),
      )
      return savedTask
    } catch (requestError) {
      setError(toErrorMessage(requestError))
      return null
    }
  }

  async function moveTask(taskId, nextStatus) {
    const task = tasks.find((currentTask) => currentTask.id === taskId)

    if (!task || task.status === nextStatus) {
      return null
    }

    return updateTask({ ...task, status: nextStatus })
  }

  function resetFilters() {
    setFilters(initialFilters)
  }

  return {
    tasks,
    visibleTasks,
    filters,
    setFilters,
    resetFilters,
    createTask,
    deleteTask,
    updateTask,
    moveTask,
    isLoading,
    error,
    reloadTasks,
    isDemoMode,
  }
}