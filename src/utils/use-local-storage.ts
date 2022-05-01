import { Accessor, createEffect, createSignal, Setter } from 'solid-js'
import { createStore, SetStoreFunction, Store } from 'solid-js/store'
import { shouldSync } from '~/lib/should-sync'

type Validate<T> = (obj: unknown) => obj is T

const getInitialValue = <T>(key: string, fallback: T, validate?: Validate<T>): T => {
  try {
    const cachedString = localStorage.getItem(key)
    if (!cachedString) return fallback
    const parsed = JSON.parse(cachedString)
    if (validate && !validate(parsed)) {
      return fallback
    }
    return parsed
  } catch (err) {
    return fallback
  }
}

export const useLocalStorage = <T>(
  key: string,
  initial: T,
  validate?: Validate<T>
): [Accessor<T>, Setter<T>] => {
  const [state, setState] = createSignal<T>(getInitialValue(key, initial, validate))
  createEffect(() => {
    if (shouldSync()) localStorage.setItem(key, JSON.stringify(state()))
  })
  return [state, setState]
}

export const useLocalStorageStore = <T>(
  key: string,
  initial: T,
  validate?: Validate<T>
): [Store<T>, SetStoreFunction<T>] => {
  const [store, setStore] = createStore<T>(getInitialValue(key, initial, validate))
  createEffect(() => {
    if (shouldSync()) localStorage.setItem(key, JSON.stringify(store))
  })
  return [store, setStore]
}
