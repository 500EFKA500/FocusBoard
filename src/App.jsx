import useLocalStorage from './hooks/useLocalStorage.js'
import { useState } from 'react'
import EditTaskForm from './components/EditTaskForm.jsx'
import TaskCard from './components/TaskCard.jsx'
import seedTasks from './data/seedTasks.js'
import AddTaskForm from './components/AddTaskForm.jsx'
import BoardColumn from './components/BoardColumn.jsx'
import TaskFilters from './components/TaskFilters.jsx'

const columns = [
  { id: 'backlog', title: 'Бэклог', description: 'Задачи на потом' },
  { id: 'in-progress', title: 'В работе', description: 'Текущий фокус' },
  { id: 'review', title: 'На проверке', description: 'Задачи на проверке' },
  { id: 'done', title: 'Готово', description: 'Завершённые задачи' },
]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('focus-board-tasks', seedTasks)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({ query: '', priority: 'all' })
  const normalizedQuery = filters.query.trim().toLowerCase()

  const visibleTasks = tasks.filter((task) => {
    const matchesQuery =
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.description.toLowerCase().includes(normalizedQuery)
    const matchesPriority =
      filters.priority === 'all' || task.priority === filters.priority

    return matchesQuery && matchesPriority
  })

  function handleDeleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  function handleUpdateTask(updatedTask) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    )
    setEditingTask(null)
  }

  function handleCreateTask(draft) {
    const newTask = {
      id: crypto.randomUUID(),
      ...draft,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  function handleMoveTask(taskId, nextStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    )
  }
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Personal productivity</p>
        <h1>FocusBoard</h1>
        <p className="subtitle">Небольшая доска, чтобы держать рабочие задачи в фокусе.</p>
      </header>

      <AddTaskForm columns={columns} onCreate={handleCreateTask} />

      {editingTask && (
        <EditTaskForm
          key={editingTask.id}
          task={editingTask}
          columns={columns}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
      
      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ query: '', priority: 'all' })}
        totalCount={tasks.length}
        visibleCount={visibleTasks.length}
      />
      
      <section aria-label="Доска задач" className="board">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={visibleTasks.filter((task) => task.status === column.id)}
            onDelete={handleDeleteTask}
            onEdit={setEditingTask}
            onMoveTask={handleMoveTask}
          />
        ))}
      </section>
    </main>
  )
}
