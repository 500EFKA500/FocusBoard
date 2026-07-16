import './TaskDeleteButton.css'

export default function TaskDeleteButton({ onDelete }) {
  return (
    <button
      className="task-delete-button"
      type="button"
      onClick={onDelete}
      aria-label="Удалить задачу"
    >
      Удалить
    </button>
  )
}
