import { useState } from 'react'
import TaskCard from './TaskCard.jsx'
import './BoardColumn.css'

export default function BoardColumn({ column, tasks, onDelete, onEdit, onMoveTask }) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragStart(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId)
    event.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  function handleDrop(event) {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain')
    setIsDragOver(false)

    if (taskId) {
      onMoveTask(taskId, column.id)
    }
  }

  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  return (
    <section
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      aria-labelledby={column.id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-heading">
        <h2 id={column.id}>{column.title}</h2>
        <span aria-label={`${tasks.length} задач`}>{tasks.length}</span>
      </div>
      <p>{column.description}</p>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onDragStart={(event) => handleDragStart(event, task.id)}
            onDragEnd={() => setIsDragOver(false)}
          />
        ))}
      </div>
      <button type="button">Добавить задачу</button>
    </section>
  )
}