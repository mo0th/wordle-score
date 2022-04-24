import { Component, Show } from 'solid-js'
import { useSettings } from '~/lib/settings'
import Container from '../Container'

const SandboxModeIndicator: Component = () => {
  const [settings] = useSettings()
  return (
    <Show when={settings.sandboxMode}>
      <div class="fixed inset-x-0 top-0 z-40 bg-yellow-300 py-2 font-bold text-black">
        <Container>Sandbox mode enabled - score changes won't be saved</Container>
      </div>
    </Show>
  )
}

export default SandboxModeIndicator
