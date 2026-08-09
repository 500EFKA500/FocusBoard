import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskCard from './TaskCard.jsx'

const task = { id: 'task-1', title: 'Доступная задача', description: 'Проверяем перемещение с клавиатуры.', status: 'backlog', priority: 'medium' }

describe('TaskCard', () => {
  it('moves a task with the column select', async () => {
    const user = userEvent.setup()
    const onMove = vi.fn()
    render(<TaskCard task={task} onDelete={vi.fn()} onMove={onMove} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /переместить задачу/i }), 'done')

    expect(onMove).toHaveBeenCalledWith('task-1', 'done')
  })
})