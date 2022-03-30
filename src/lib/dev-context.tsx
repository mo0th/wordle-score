import {
  Accessor,
  Component,
  createContext,
  Setter,
  useContext,
} from 'solid-js'
import { useLocalStorage } from '../utils/use-local-storage'

const DevContext = createContext<
  [get: Accessor<boolean>, set: Setter<boolean>] | null
>()

export const DevProvider: Component = props => {
  const [dev, setDev] = useLocalStorage('mooth:wordle-score-dev', false)

  return (
    <DevContext.Provider value={[dev, setDev]}>
      {props.children}
    </DevContext.Provider>
  )
}

export const useDev = () => {
  const ctx = useContext(DevContext)
  if (!ctx) throw new Error('useDev must be inside <DevProvider>')
  return ctx
}
