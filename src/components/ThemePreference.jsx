const options = [
  { value: 'system', label: 'Как в системе' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
]

export default function ThemePreference({ theme, onChange }) {
  return (
    <label className="theme-preference">
      <span>Тема</span>
      <select value={theme} onChange={(event) => onChange(event.target.value)} aria-label="Выбрать тему интерфейса">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}