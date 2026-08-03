import { useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage.js'

const initialFilters = {
  query: '',
  priority: 'all',
}

export default function useTasks(initialTasks) {
  const [tasks, setTasks] = useLocalStorage('focus-board-tasks', initialTasks)
  const [filters, setFilters] = useState(initialFilters)

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

  function createTask(draft) {
    const newTask = {
      id: crypto.randomUUID(),
      ...draft,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  function updateTask(updatedTask) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    )
  }

  function moveTask(taskId, nextStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    )
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
  }
}