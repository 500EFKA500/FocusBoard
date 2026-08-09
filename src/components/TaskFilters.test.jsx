import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TaskFilters from './TaskFilters.jsx'

function FilterHarness() {
  const [filters, setFilters] = useState({ query: '', priority: 'all' })

  return <TaskFilters filters={filters} onChange={setFilters} onReset={() => setFilters({ query: '', priority: 'all' })} totalCount={4} visibleCount={2} />
}

describe('TaskFilters', () => {
  it('changes and resets search filters', async () => {
    const user = userEvent.setup()
    render(<FilterHarness />)
    const search = screen.getByRole('searchbox', { name: 'Поиск' })
    const priority = screen.getByRole('combobox', { name: 'Приоритет' })

    await user.type(search, 'API')
    await user.selectOptions(priority, 'high')

    expect(search.value).toBe('API')
    expect(priority.value).toBe('high')
    expect(screen.getByRole('button', { name: 'Сбросить' }).disabled).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(search.value).toBe('')
    expect(priority.value).toBe('all')
  })
})