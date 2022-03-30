import { Component } from 'solid-js'
import { useScoreContext } from '../lib/score-context'
import { useTheme } from '../lib/theme'
import { getCurrentDayOffset } from '../lib/wordle-stuff'

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

      <AddDay />

      <div class="h-1" />
    </details>
  )
}

const AddDay: Component = () => {
  const [{ record }, { setDayScore }] = useScoreContext()

  let input: HTMLInputElement | undefined

  const handleAdd = () => {
    const day = input?.valueAsNumber
    if (!day || typeof day !== 'number' || Number.isNaN(day)) return
    if (day > getCurrentDayOffset()) return
    if (record()[day]) return

    setDayScore(day, 'X')
  }

  return (
    <div class="space-y-4">
      <label for="day-to-add">Add an older day</label>
      <div class="flex items-stretch space-x-4">
        <input
          ref={input}
          class="form-input flex-1 block w-full"
          type="number"
          id="day-to-add"
          min={1}
          // @ts-expect-error no types for solid's attr:__ yet
          attr:value={1}
          max={getCurrentDayOffset() - 1}
        />
        <button
          onClick={handleAdd}
          class="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex-shrink-0"
        >
          Add Day
        </button>
      </div>
    </div>
  )
}
