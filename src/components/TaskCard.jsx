import './TaskCard.css'
import TaskDeleteButton from './TaskDeleteButton.jsx'

const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }

export default function TaskCard({ task, onDelete }) {
  return (
    <article className="task-card">
      <span className={`priority priority--${task.priority}`}>{priorityLabels[task.priority]}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <TaskDeleteButton onDelete={() => onDelete(task.id)} />
    </article>
  )
}
