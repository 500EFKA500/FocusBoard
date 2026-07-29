import { useState } from 'react'
import './EditTaskForm.css'

export default function EditTaskForm({ task, columns, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  })

  function handleChange(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!draft.title.trim()) {
      return
    }

    onSave({
      ...task,
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    })
  }

  return (
    <form className="edit-task-form" onSubmit={handleSubmit}>
      <div className="edit-task-form__heading">
        <div>
          <p className="eyebrow">Editing task</p>
          <h2>Редактировать задачу</h2>
        </div>
        <div className="edit-task-form__actions">
          <button className="button button--secondary" type="button" onClick={onCancel}>
            Отмена
          </button>
          <button className="button button--primary" type="submit">
            Сохранить
          </button>
        </div>
      </div>

      <label>
        Название
        <input name="title" value={draft.title} onChange={handleChange} required />
      </label>

      <label>
        Описание
        <textarea name="description" value={draft.description} onChange={handleChange} rows="3" />
      </label>

      <div className="edit-task-form__selects">
        <label>
          Колонка
          <select name="status" value={draft.status} onChange={handleChange}>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>{column.title}</option>
            ))}
          </select>
        </label>

        <label>
          Приоритет
          <select name="priority" value={draft.priority} onChange={handleChange}>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </label>
      </div>
    </form>
  )
}