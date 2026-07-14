const columns = [
  { id: 'backlog', title: 'Бэклог', description: 'Задачи на потом' },
  { id: 'in-progress', title: 'В работе', description: 'Текущий фокус' },
  { id: 'in-check', title: 'На проверке', description: 'Задачи на проверке' },
  { id: 'done', title: 'Готово', description: 'Завершённые задачи' },
]

export default function App() {
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
              <span aria-label="Пока нет задач">0</span>
            </div>
            <p>{column.description}</p>
            <button type="button">Добавить задачу</button>
          </section>
        ))}
      </section>
    </main>
  )
}
