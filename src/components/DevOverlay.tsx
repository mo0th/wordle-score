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
      class="fixed inset-x-0 bottom-0 !m-0 motion-safe:transition-transform"
      style={{ transform: show() ? '' : 'translateY(calc(100% - 2rem))' }}
    >
      <Container>
        <div class="">
          <button
            class={cx(
              classes.bg,

              'rounded-t px-2 py-1 font-mono'
            )}
            onClick={() => setShow(toggle)}
          >
            {'</>'}
          </button>
        </div>
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

export default DevOverlay
