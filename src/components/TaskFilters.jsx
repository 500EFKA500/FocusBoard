import './TaskFilters.css'

export default function TaskFilters({ filters, onChange, onReset, totalCount, visibleCount }) {
  function handleChange(event) {
    const { name, value } = event.target
    onChange((currentFilters) => ({ ...currentFilters, [name]: value }))
  }

  const hasActiveFilters = filters.query || filters.priority !== 'all'

  return (
    <section className="task-filters" aria-label="Фильтры задач">
      <div className="task-filters__heading">
        <div>
          <p className="eyebrow">Find your focus</p>
          <h2>Поиск и фильтры</h2>
        </div>
        <span>{visibleCount} из {totalCount}</span>
      </div>

      <div className="task-filters__controls">
        <label>
          Поиск
          <input
            type="search"
            name="query"
            value={filters.query}
            onChange={handleChange}
            placeholder="Название или описание"
          />
        </label>

        <label>
          Приоритет
          <select name="priority" value={filters.priority} onChange={handleChange}>
            <option value="all">Все приоритеты</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </label>

        <button type="button" onClick={onReset} disabled={!hasActiveFilters}>
          Сбросить
        </button>
      </div>
    </section>
  )
}