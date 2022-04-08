import { dequal } from 'dequal'
import { Component, JSXElement, Show } from 'solid-js'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { toggle } from '~/utils/misc'
import Button from './Button'
import Collapse from './Collapse'

export const StuffAndSettings: Component = () => {
  const [{ syncDetails, canRestore }, { setSyncDetails, restoreFromSaved }] =
    useScoreContext()
  const [settings, setSettings] = useSettings()

  return (
    <Collapse summary="Stuff and Settings">
      <SettingsToggle
        label="Theme"
        onToggle={() =>
          setSettings('theme', t => (t === 'dark' ? 'light' : 'dark'))
        }
        value={settings.theme === 'dark'}
        onChild="Dark"
        offChild="Light"
      />

      <SettingsToggle
        label="Animated Numbers"
        value={settings.animatedCounts}
        onToggle={() => setSettings('animatedCounts', toggle)}
        onChild="On"
        offChild="Off"
      />

      <SettingsToggle
        label="Sync Indicators"
        value={settings.showSyncIndicators}
        onToggle={() => setSettings('showSyncIndicators', toggle)}
        onChild="On"
        offChild="Off"
      />

      <div class="space-y-4">
        <SettingsToggle
          label="Dev Stuff"
          value={settings.devStuff}
          onToggle={() => setSettings('devStuff', toggle)}
          onChild="Disable"
          offChild="Enable"
        />
        <Show when={settings.devStuff}>
          <p class="text-sm">Some stuff might be broken so be careful!</p>
        </Show>
      </div>

      <hr class="dark:border-gray-600 border-gray-300" />

      <form
        class="space-y-4"
        onSubmit={event => {
          event.preventDefault()
          const data = Object.fromEntries(new FormData(event.currentTarget))
          setSyncDetails(current => {
            if (
              dequal(data, current) ||
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
          />
        </div>
        <Button type="submit" block>
          Save Sync Details
        </Button>
        <Show when={canRestore()}>
          <Button type="button" block onClick={restoreFromSaved}>
            Restore Saved Data
          </Button>
        </Show>
      </form>
    </Collapse>
  )
}

const SettingsToggle: Component<{
  value: boolean
  onToggle: () => void
  label: string
  onChild: JSXElement
  offChild: JSXElement
}> = props => {
  return (
    <div class="flex justify-between items-center">
      <p>{props.label}</p>
      <Button onClick={() => props.onToggle()}>
        <Show when={props.value} fallback={props.offChild}>
          {props.onChild}
        </Show>
      </Button>
    </div>
  )
}
