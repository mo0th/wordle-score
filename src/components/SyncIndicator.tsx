import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  Show,
} from 'solid-js'
import { useScoreContext } from '../lib/score-context'

const INDICATOR_TEXT = {
  idle: '',
  failed: 'Failed to sync. Try reloading.',
  loading: 'Syncing your score',
  success: 'Synced changes ✅',
} as const

const SyncIndicator: Component = () => {
  const [{ syncStatus }] = useScoreContext()
  const [showIndicator, setShowIndicator] = createSignal(true)

  let timeout: NodeJS.Timeout

  createEffect(() => {
    const status = syncStatus()

    if (status === 'idle') {
      setShowIndicator(false)
    } else if (status === 'loading') {
      setShowIndicator(true)
    } else {
      setShowIndicator(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowIndicator(false), 2000)
    }
  })

  onCleanup(() => {
    clearTimeout(timeout)
  })

  return (
    <div
      class="flex fixed top-4 py-2 px-4 rounded bg-slate-200 dark:bg-slate-700 shadow-lg left-1/2 -translate-x-1/2 transition-transform items-center space-x-2 text-lg"
      classList={{
        '-translate-y-24': !showIndicator(),
        'translate-y-0': showIndicator(),
      }}
      style={{
        width: `calc(100% - 8rem)`,
        'max-width': '16rem',
      }}
    >
      <p class="flex-1">{INDICATOR_TEXT[syncStatus()]}</p>
      <button onClick={() => setShowIndicator(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default SyncIndicator
