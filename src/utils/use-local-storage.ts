import { Accessor, createEffect, createSignal, Setter } from 'solid-js'

const getInitialValue = <T>(key: string, fallback: T): T => {
  try {
    const cachedString = localStorage.getItem(key)
    if (!cachedString) return fallback
    const parsed = JSON.parse(cachedString)
    return parsed
  } catch (err) {
    return fallback
  }
}

export const useLocalStorage = <T>(
  key: string,
  initial: T
): [Accessor<T>, Setter<T>] => {
  const [state, setState] = createSignal<T>(getInitialValue(key, initial))
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(state()))
  })
  return [state, setState]
}
