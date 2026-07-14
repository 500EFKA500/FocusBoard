import { useState } from 'react'
import TaskCard from './components/TaskCard.jsx'
import seedTasks from './data/seedTasks.js'

const columns = [
  { id: 'backlog', title: 'Бэклог', description: 'Задачи на потом' },
  { id: 'in-progress', title: 'В работе', description: 'Текущий фокус' },
  { id: 'in-check', title: 'На проверке', description: 'Задачи на проверке' },
  { id: 'done', title: 'Готово', description: 'Завершённые задачи' },
]

export default function App() {
  const [tasks] = useState(seedTasks)

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Personal productivity</p>
        <h1>FocusBoard</h1>
        <p className="subtitle">Небольшая доска, чтобы держать рабочие задачи в фокусе.</p>
      </header>

      <section aria-label="Доска задач" className="board">
        {columns.map((column) => (
          <section className="column" key={column.id} aria-labelledby={column.id}>
            <div className="column-heading">
              <h2 id={column.id}>{column.title}</h2>
              <span aria-label="Пока нет задач">{tasks.filter((tasks) => tasks.status === column.id).length}</span>
            </div>
            <p>{column.description}</p>
            <div className="task-list">
              {tasks
                .filter((tasks) => tasks.status === column.id)
                .map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
            <button type="button">Добавить задачу</button>
          </section>
        ))}
      </section>
    </main>
  )
}
