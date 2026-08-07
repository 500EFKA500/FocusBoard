import './ApiStatus.css'

export default function ApiStatus({ isLoading, error, onRetry }) {
  if (isLoading) {
    return <p className="api-status" role="status">Загружаем задачи с сервера…</p>
  }

  if (error) {
    return (
      <div className="api-status api-status--error" role="alert">
        <p>Не удалось синхронизировать задачи: {error}</p>
        <button type="button" onClick={onRetry}>Повторить</button>
      </div>
    )
  }

  return null
}