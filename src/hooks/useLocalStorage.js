import { useEffect, useState } from 'react'

function readStoredValue(key, initialValue) {
  try {
    const storedValue = localStorage.getItem(key)

    return storedValue ? JSON.parse(storedValue) : initialValue
  } catch (error) {
    console.warn(`Не удалось прочитать данные из localStorage по ключу "${key}"`, error)
    return initialValue
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Не удалось сохранить данные в localStorage по ключу "${key}"`, error)
    }
  }, [key, value])

  return [value, setValue]
}
