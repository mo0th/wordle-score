import { Accessor, createEffect } from 'solid-js'
import { useLocalStorage } from '../utils/use-local-storage'

type Theme = 'light' | 'dark'

export const useTheme = (): [Accessor<Theme>, (theme?: Theme) => void] => {
  const [theme, setTheme] = useLocalStorage<Theme>(
    'mooth:wordle-score-theme',
    'dark'
  )

  createEffect(() => {
    const t = theme()
    const htmlClasses = document.documentElement.classList

    if (t === 'light') {
      htmlClasses.remove('dark')
    } else {
      htmlClasses.add('dark')
    }
  })

  const toggle = (next?: Theme) => {
    if (next === undefined) {
      setTheme(theme => (theme === 'light' ? 'dark' : 'light'))
    } else {
      setTheme(next)
    }
  }

  return [theme, toggle]
}
