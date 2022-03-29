import { Component } from 'solid-js'
import { useScoreContext } from '../lib/score-context'
import { useTheme } from '../lib/theme'

export const Settings: Component = () => {
  const [theme, toggleTheme] = useTheme()
  const [{ syncDetails }, { setSyncDetail }] = useScoreContext()

  return (
    <details class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 space-y-4">
      <summary class="cursor-pointer -my-2 py-2">Settings and stuff</summary>

      <div class="flex justify-between items-center">
        <p>Theme: </p>
        <button
          class="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          onClick={() => toggleTheme()}
        >
          Switch to {theme() === 'dark' ? 'light' : 'dark'}
        </button>
      </div>

      <div class="space-y-4">
        <p>Sync</p>
        <div class="space-y-2 flex flex-col">
          <label class="text-sm">Username</label>
          <input
            type="text"
            class="form-input"
            value={syncDetails().user}
            onInput={e => setSyncDetail('user', e.currentTarget.value)}
          />
        </div>
        <div class="space-y-2 flex flex-col">
          <label class="text-sm">Password</label>
          <input
            type="password"
            class="form-input"
            value={syncDetails().password}
            onInput={e => setSyncDetail('password', e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="h-1" />
    </details>
  )
}
