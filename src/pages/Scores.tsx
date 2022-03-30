import { Link, Navigate } from 'solid-app-router'
import { Component, createMemo, For, Show } from 'solid-js'
import { useDev } from '../lib/dev-context'
import { useScoreContext } from '../lib/score-context'
import { PersonScore } from '../types'

const Scores: Component = () => {
  const [{ canSync, allScores }] = useScoreContext()
  const [isDev] = useDev()

  const entries = createMemo(() => {
    const sorted = (
      Object.entries(allScores() || {}) as [string, PersonScore][]
    ).sort(([, a], [, b]) => b.score - a.score)

    if (!isDev()) {
      return sorted.filter(([name]) => !name.endsWith('-testing'))
    }

    return sorted
  })

  return (
    <Show when={canSync()} fallback={<Navigate href="/" />}>
      <div class="text-center space-y-8">
        <h2 class="text-2xl mb-8">Other People's Scores</h2>
        <div class="space-y-4">
          <Show
            when={Boolean(allScores())}
            fallback={<p class="text-center">loading</p>}
          >
            <For
              each={entries()}
              fallback={<p>No one's added their scores yet :(</p>}
            >
              {([user, record]) => (
                <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                  <p class="font-bold text-lg">{user}</p>
                  <p class="text-2xl mb-1">Score: {record.score}</p>
                  <p class="text-sm">
                    {record.daysPlayed} day{record.daysPlayed === 1 ? '' : 's'}{' '}
                    played
                  </p>
                </div>
              )}
            </For>
          </Show>
        </div>

        <Link class="underline block" href="/">
          Go Home
        </Link>
      </div>
    </Show>
  )
}

export default Scores
