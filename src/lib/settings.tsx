import * as types from 'pheno'
import { createContext, Component, useContext, createEffect } from 'solid-js'
import { SetStoreFunction, Store } from 'solid-js/store'
import { useLocalStorageStore } from '~/utils/use-local-storage'
import { addSyncCondition } from './should-sync'
import { Theme, updateThemeInDocument } from './theme'

export type Settings = {
  animatedCounts: boolean
  showSyncIndicators: boolean
  devStuff: boolean
  theme: Theme
  plausible: boolean
  colorScores: boolean
  glowyNumbers: boolean
  shortenBigNumbers: boolean
  showTestingUsers: boolean
  showDoneCheckmark: boolean
  sandboxMode: boolean
}

const SettingsContext = createContext<[Store<Settings>, SetStoreFunction<Settings>]>()
const DEFAULTS: Settings = {
  animatedCounts: true,
  showSyncIndicators: true,
  devStuff: false,
  theme: 'dark',
  plausible: true,
  colorScores: true,
  glowyNumbers: true,
  shortenBigNumbers: true,
  showTestingUsers: false,
  showDoneCheckmark: true,
  sandboxMode: false,
}

const [settings, setSettings] = useLocalStorageStore<Settings>(
  'mooth:wordle-score-settings',
  DEFAULTS,
  (val: unknown): val is Settings => {
    if (!types.isOfType(val, types.record(types.string, types.any))) return false
    for (const key in DEFAULTS) {
      if (!(key in val)) {
        val[key] = DEFAULTS[key as keyof Settings]
      }
    }
    return true
  }
)

const EPHEMERAL_SETTINGS: (keyof Settings)[] = ['sandboxMode']
setSettings(Object.fromEntries(EPHEMERAL_SETTINGS.map(key => [key, DEFAULTS[key]])))

addSyncCondition(() => !settings.sandboxMode)

export { settings }
export const SettingsProvider: Component = props => {
  createEffect(() => {
    updateThemeInDocument(settings.theme)
  })

  createEffect(() => {
    if (settings.plausible) {
      localStorage.setItem('plausible_ignore', 'true')
    } else {
      localStorage.removeItem('plausible_ignore')
    }
  })

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)

  if (!ctx) {
    throw new Error('useSettings must be used inside <SettingsProvider>')
  }

  return ctx
}
