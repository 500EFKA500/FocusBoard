import { useCallback, useEffect, useMemo, useState } from 'react'
import { createTask as createTaskRequest, deleteTask as deleteTaskRequest, fetchTasks, updateTask as updateTaskRequest } from '../api/tasksApi.js'
import useLocalStorage from './useLocalStorage.js'

const initialFilters = {
  query: '',
  priority: 'all',
}

function toErrorMessage(error) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка.'
}

export default function useTasks(initialTasks) {
  const [tasks, setTasks] = useLocalStorage('focus-board-tasks', initialTasks)
  const [filters, setFilters] = useState(initialFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const reloadTasks = useCallback(async () => {
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
  }
}