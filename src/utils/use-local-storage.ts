import { TypeValidator } from 'pheno'
import { Accessor, createEffect, createSignal, Setter } from 'solid-js'
import { createStore, SetStoreFunction, Store } from 'solid-js/store'

const acceptAllValidator = (() => true) as unknown as TypeValidator<any>
const getInitialValue = <T>(
  key: string,
  fallback: T,
  validate: TypeValidator<T> = acceptAllValidator
): T => {
  try {
    const cachedString = localStorage.getItem(key)
    if (!cachedString) return fallback
    const parsed = JSON.parse(cachedString)
    if (!validate(parsed)) return fallback
    return parsed
  } catch (err) {
    return fallback
  }
}

export const useLocalStorage = <T>(
  key: string,
  initial: T,
  validate?: TypeValidator<T>
): [Accessor<T>, Setter<T>] => {
  const [state, setState] = createSignal<T>(getInitialValue(key, initial, validate))
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(state()))
  })
  return [state, setState]
}

export const useLocalStorageStore = <T>(
  key: string,
  initial: T,
  validate?: TypeValidator<T>
): [Store<T>, SetStoreFunction<T>] => {
  const [store, setStore] = createStore<T>(getInitialValue(key, initial, validate))
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(store))
  })
  return [store, setStore]
}
