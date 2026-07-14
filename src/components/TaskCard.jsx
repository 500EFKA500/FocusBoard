import './TaskCard.css'

const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }

export default function TaskCard({ task }) {
  return (
    <article className="task-card">
      <span className={`priority priority--${task.priority}`}>{priorityLabels[task.priority]}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </article>
  )
}
