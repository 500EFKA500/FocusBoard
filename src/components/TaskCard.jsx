import './TaskCard.css'
import TaskDeleteButton from './TaskDeleteButton.jsx'

const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }

export default function TaskCard({ task, onDelete, onEdit }) {
  return (
    <article className="task-card">
      <span className={`priority priority--${task.priority}`}>{priorityLabels[task.priority]}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-card__actions">
        {onEdit && (
          <button className="task-edit-button" type="button" onClick={() => onEdit(task)}>
            Редактировать
          </button>
        )}
        <TaskDeleteButton onDelete={() => onDelete(task.id)} />
      </div>
    </article>
  )
}
