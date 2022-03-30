import { Component } from 'solid-js'
import { useDev } from '../lib/dev-context'
import { useScoreContext } from '../lib/score-context'
import { useTheme } from '../lib/theme'
import { getCurrentDayOffset } from '../lib/wordle-stuff'

export const StuffAndSettings: Component = () => {
  const [theme, toggleTheme] = useTheme()
  const [isDev, setIsDev] = useDev()
  const [{ syncDetails }, { setSyncDetails }] = useScoreContext()

  return (
    <details class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 space-y-4">
      <summary class="cursor-pointer -my-2 py-2">Stuff and settings</summary>

      <AddDay />

      <div class="flex justify-between items-center">
        <p>Theme</p>
        <button
          class="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          onClick={() => toggleTheme()}
        >
          Switch to {theme() === 'dark' ? 'light' : 'dark'}
        </button>
      </div>

      <form
        class="space-y-4"
        onSubmit={event => {
          event.preventDefault()
          const data = Object.fromEntries(new FormData(event.currentTarget))
          setSyncDetails(current => {
            if (
              (current.password === data.password &&
                current.user === data.user) ||
              typeof data.password !== 'string' ||
              typeof data.user !== 'string'
            ) {
              return current
            }

            return { password: data.password, user: data.user }
          })
        }}
      >
        <p>Sync Details</p>
        <div class="space-y-2 flex flex-col">
          <label class="text-sm" for="sync-user">
            Username
          </label>
          <input
            type="text"
            class="form-input"
            name="user"
            id="sync-user"
            // @ts-expect-error
            attr:value={syncDetails().user}
          />
        </div>
        <div class="space-y-2 flex flex-col">
          <label class="text-sm" for="sync-password">
            Password
          </label>
          <input
            type="password"
            class="form-input"
            name="password"
            id="sync-password"
            // @ts-expect-error
            attr:value={syncDetails().password}
          />
        </div>
        <button class="block w-full px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
          Save Sync Details
        </button>
      </form>

      <div class="flex justify-between items-center">
        <p>Dev Stuff</p>
        <button
          class="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          onClick={() => setIsDev(p => !p)}
        >
          {isDev() ? 'Hide' : 'Show'}
        </button>
      </div>
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
          attr:value={getCurrentDayOffset() - 1}
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
