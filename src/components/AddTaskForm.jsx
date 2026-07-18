import { useState } from 'react'
import './AddTaskForm.css'

const initialDraft = {
  title: '',
  description: '',
  status: 'backlog',
  priority: 'medium',
}

export default function AddTaskForm({ columns, onCreate }) {
  const [draft, setDraft] = useState(initialDraft)

  function handleChange(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!draft.title.trim()) {
      return
    }

    onCreate({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
    })
    setDraft(initialDraft)
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">New task</p>
          <h2>Добавить задачу</h2>
        </div>
        <button type="submit">Создать</button>
      </div>

      <label>
        Название
        <input
          name="title"
          value={draft.title}
          onChange={handleChange}
          placeholder="Например, проверить макет"
          required
        />
      </label>

      <label>
        Описание
        <textarea
          name="description"
          value={draft.description}
          onChange={handleChange}
          placeholder="Коротко опишите результат"
          rows="3"
        />
      </label>

      <div className="form-selects">
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
