import { useState } from 'react'
import useTasks from './hooks/useTasks.js'
import EditTaskForm from './components/EditTaskForm.jsx'
import seedTasks from './data/seedTasks.js'
import AddTaskForm from './components/AddTaskForm.jsx'
import ApiStatus from './components/ApiStatus.jsx'
import BoardColumn from './components/BoardColumn.jsx'
import TaskFilters from './components/TaskFilters.jsx'

const columns = [
  { id: 'backlog', title: 'Бэклог', description: 'Задачи на потом' },
  { id: 'in-progress', title: 'В работе', description: 'Текущий фокус' },
  { id: 'review', title: 'На проверке', description: 'Задачи на проверке' },
  { id: 'done', title: 'Готово', description: 'Завершённые задачи' },
]

export default function App() {
  const [editingTask, setEditingTask] = useState(null)
  const {
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
  } = useTasks(seedTasks)

  async function handleSaveTask(updatedTask) {
    const savedTask = await updateTask(updatedTask)

    if (savedTask) {
      setEditingTask(null)
    }
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Personal productivity</p>
        <h1>FocusBoard</h1>
        <p className="subtitle">Небольшая доска, чтобы держать рабочие задачи в фокусе.</p>
      </header>

      <ApiStatus isLoading={isLoading} error={error} onRetry={reloadTasks} />
      <AddTaskForm columns={columns} onCreate={createTask} />

      {editingTask && (
        <EditTaskForm
          key={editingTask.id}
          task={editingTask}
          columns={columns}
          onSave={handleSaveTask}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        totalCount={tasks.length}
        visibleCount={visibleTasks.length}
      />

      <section aria-label="Доска задач" className="board" aria-busy={isLoading}>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={visibleTasks.filter((task) => task.status === column.id)}
            onDelete={deleteTask}
            onEdit={setEditingTask}
            onMoveTask={moveTask}
          />
        ))}
      </section>
    </main>
  )
}