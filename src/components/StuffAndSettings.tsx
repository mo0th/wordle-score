import { Component } from 'solid-js'
import { useDev } from '../lib/dev-context'
import { useScoreContext } from '../lib/score-context'
import { useTheme } from '../lib/theme'
import Button from './Button'
import Collapse from './Collapse'

export const StuffAndSettings: Component = () => {
  const [theme, toggleTheme] = useTheme()
  const [isDev, setIsDev] = useDev()
  const [{ syncDetails }, { setSyncDetails }] = useScoreContext()

  return (
    <Collapse summary="Stuff and Settings">
      <div class="flex justify-between items-center">
        <p>Theme</p>
        <Button onClick={() => toggleTheme()}>
          Switch to {theme() === 'dark' ? 'light' : 'dark'}
        </Button>
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
        <Button type="submit" block>
          Save Sync Details
        </Button>
      </form>

      <div class="flex justify-between items-center">
        <p>Dev Stuff</p>
        <Button onClick={() => setIsDev(p => !p)}>
          {isDev() ? 'Hide' : 'Show'}
        </Button>
      </div>
    </Collapse>
  )
}
