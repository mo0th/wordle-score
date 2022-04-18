import { Component, Show } from 'solid-js'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { RefreshIcon } from '~/components/icons'

const ScoresPullIndicator: Component = () => {
  const [{ allScores }] = useScoreContext()
  const [settings] = useSettings()
  return (
    <Show when={settings.showSyncIndicators || true}>
      <div
        class="fixed left-4 top-4 transition-transform"
        style={{
          transform: `translateY(${allScores.loading ? 0 : '-3rem'})`,
        }}
      >
        <RefreshIcon class="h-6 w-6 animate-spin text-purple-400/75" />
      </div>
    </Show>
  )
}

export default ScoresPullIndicator
