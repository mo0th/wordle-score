import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import { useSettings } from '~/lib/settings'
import { cx, toggle } from '~/utils/misc'
import Container from './Container'
import { SettingsToggle } from './settings/StuffAndSettings'

const classes = {
  bg: 'bg-purple-200 dark:bg-purple-800',
}

const DevOverlay: Component = () => {
  const [show, setShow] = createSignal(false)
  const [settings, setSettings] = useSettings()

  return (
    <div
      class="fixed inset-x-0 bottom-0 !m-0 drop-shadow-md transition motion-reduce:transition-opacity"
      classList={{
        'opacity-50 translate-y-full': !show(),
        'opacity-100': show(),
      }}
    >
      <Container class="relative">
        <button
          class={cx(
            classes.bg,
            'absolute top-0 left-8 -translate-y-full rounded-t px-2 py-1 font-mono hover:bg-purple-300 dark:hover:bg-purple-700'
          )}
          onClick={() => setShow(toggle)}
        >
          {'</>'}
          <span class="sr-only">Open / Close Dev Overlay</span>
        </button>

        <div
          class={cx(classes.bg, 'space-y-6 overflow-y-auto p-4')}
          style="max-height: 80vh; min-height: 30vh"
        >
          <WindowSize />

          <SettingsToggle
            label="Plausible"
            value={settings.plausible}
            onToggle={() => setSettings('plausible', toggle)}
            onChild="On"
            offChild="Off"
          />

          <SettingsToggle
            label="Show testing users"
            value={settings.showTestingUsers}
            onToggle={() => setSettings('showTestingUsers', toggle)}
            onChild="On"
            offChild="Off"
          />

          <Explode />

          <div class="space-y-4">
            <SettingsToggle
              label="Dev Stuff"
              value={settings.devStuff}
              onToggle={() => setSettings('devStuff', toggle)}
              onChild="Disable"
              offChild="Enable"
            />
            <p class="text-sm">Disabling will hide this overlay</p>
          </div>
        </div>
      </Container>
    </div>
  )
}

const WindowSize = () => {
  const [size, setSize] = createSignal({ width: window.innerWidth, height: window.innerHeight })

  createEffect(() => {
    const handle = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handle)
    onCleanup(() => window.removeEventListener('resize', handle))
  })

  return (
    <div class="flex justify-between">
      <p>Window Size</p>
      <p class="font-mono">
        {size().width} x {size().height}
      </p>
    </div>
  )
}

const Explode = () => {
  const label = 'Explosion! 🔥 💣'
  const [exploded, setExploded] = createSignal(false)

  createEffect(() => {
    console.log('asdf')
    if (exploded()) throw new Error(label)
  })

  return (
    <SettingsToggle
      label={label}
      value
      onToggle={() => setExploded(true)}
      onChild="Booom"
      offChild={null}
    />
  )
}

export default DevOverlay
