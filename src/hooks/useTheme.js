import { useEffect, useState } from 'react'

const storageKey = 'focus-board-theme'

function getInitialTheme() {
  const savedTheme = localStorage.getItem(storageKey)

  if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
    return savedTheme
  }

  return 'system'
}

function resolveTheme(theme) {
  if (theme !== 'system') {
    return theme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    function applyTheme() {
      document.documentElement.dataset.theme = resolveTheme(theme)
      document.documentElement.style.colorScheme = resolveTheme(theme)
    }

    applyTheme()
    localStorage.setItem(storageKey, theme)

    if (theme !== 'system') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', applyTheme)

    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  return [theme, setTheme]
}