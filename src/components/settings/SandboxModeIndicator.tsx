import { Component, createEffect, Show } from 'solid-js'
import { useSettings } from '~/lib/settings'
import Container from '../Container'

const SandboxModeIndicator: Component = () => {
  const [settings] = useSettings()

  let actual: HTMLDivElement | undefined
  let padding: HTMLDivElement | undefined

  const syncHeight = () => {
    if (actual && padding) {
      padding.style.paddingTop = `${actual.clientHeight}px`
    }
  }

  createEffect(() => {
    if (settings.sandboxMode) {
      syncHeight()
    }
  })

  return (
    <Show when={settings.sandboxMode}>
      <div
        ref={actual}
        class="fixed inset-x-0 top-0 z-40 bg-yellow-300 py-2 text-center font-bold text-black"
      >
        <Container>
          Sandbox mode enabled - score changes won't be saved but please make a backup
        </Container>
      </div>
      <div ref={padding} />
    </Show>
  )
}

export default SandboxModeIndicator
