import useLocalStorage from './hooks/useLocalStorage.js'
import { useState } from 'react'
import EditTaskForm from './components/EditTaskForm.jsx'
import TaskCard from './components/TaskCard.jsx'
import seedTasks from './data/seedTasks.js'
import AddTaskForm from './components/AddTaskForm.jsx'

const columns = [
  { id: 'backlog', title: 'Бэклог', description: 'Задачи на потом' },
  { id: 'in-progress', title: 'В работе', description: 'Текущий фокус' },
  { id: 'review', title: 'На проверке', description: 'Задачи на проверке' },
  { id: 'done', title: 'Готово', description: 'Завершённые задачи' },
]

export default function App() {
  const [tasks, setTasks] = useLocalStorage('focus-board-tasks', seedTasks)
  const [editingTask, setEditingTask] = useState(null)

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
      
      <section aria-label="Доска задач" className="board">
        {columns.map((column) => (
          <section className="column" key={column.id} aria-labelledby={column.id}>
            <div className="column-heading">
              <h2 id={column.id}>{column.title}</h2>
              <span aria-label="Пока нет задач">{tasks
                .filter((tasks) => tasks.status === column.id).length}</span>
            </div>
            <p>{column.description}</p>
            <div className="task-list">
              {tasks
                .filter((tasks) => tasks.status === column.id)
                .map((task) => <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={handleDeleteTask} 
                  onEdit={setEditingTask} 
                />)}
            </div>
            <button type="button">Добавить задачу</button>
          </section>
        ))}
      </section>
    </main>
  )
}
