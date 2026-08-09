import './TaskCard.css'
import TaskDeleteButton from './TaskDeleteButton.jsx'

const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }
const statusLabels = { backlog: 'Бэклог', 'in-progress': 'В работе', review: 'На проверке', done: 'Готово' }

export default function TaskCard({ task, onDelete, onEdit, onMove, onDragStart, onDragEnd }) {
  return (
    <article
      className="task-card"
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <span className={`priority priority--${task.priority}`}>{priorityLabels[task.priority]}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      {onMove && (
        <label className="task-status-control">
          <span>Колонка</span>
          <select
            aria-label={`Переместить задачу «${task.title}»`}
            value={task.status}
            onChange={(event) => onMove(task.id, event.target.value)}
          >
            {Object.entries(statusLabels).map(([status, label]) => (
              <option key={status} value={status}>{label}</option>
            ))}
          </select>
        </label>
      )}
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