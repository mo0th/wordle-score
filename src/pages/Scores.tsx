import { Link, Navigate } from 'solid-app-router'
import { Component, createMemo, For, Show } from 'solid-js'
import { useDev } from '../lib/dev-context'
import { useScoreContext } from '../lib/score-context'
import { PersonScore } from '../types'
import { plural } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'

const scoreLoaderClassCommon =
  'mx-auto bg-gray-400 dark:bg-gray-500 rounded animate-pulse'
const ScoreLoader: Component = () => (
  <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 space-y-1">
    <div class={`h-7 ${scoreLoaderClassCommon}`} style="width:100px" />
    <div class={`h-8 ${scoreLoaderClassCommon}`} style="width: 150px" />
    <div class={`h-5 ${scoreLoaderClassCommon}`} style="width: 250px" />
  </div>
)

type ScoreToRender = PersonScore & {
  scorePerDay: number
}

const sortFields: Record<keyof ScoreToRender, string> = {
  daysPlayed: 'Days Played',
  score: 'Score',
  scorePerDay: 'Average Score',
  uncountedFails: 'Uncounted Fails',
}

const Scores: Component = () => {
  const [{ canSync, allScores }] = useScoreContext()
  const [isDev] = useDev()
  const [sortOptions, setSortOptions] = useLocalStorage<{
    asc: boolean
    by: keyof ScoreToRender
  }>('mooth:wordle-score-sorting', { asc: true, by: 'scorePerDay' })

  const entries = createMemo(() => {
    const opts = sortOptions()

    const sorted = (
      Object.entries(allScores() || {}) as [string, PersonScore][]
    )
      .map(
        ([name, record]) =>
          [
            name,
            {
              ...record,
              scorePerDay:
                Math.round((record.score / (record.daysPlayed || 1)) * 100) /
                100,
            },
          ] as [string, ScoreToRender]
      )
      .sort(([, a], [, b]) => (a[opts.by] - b[opts.by]) * (opts.asc ? 1 : -1))

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
            fallback={Array.from({ length: 4 }, () => (
              <ScoreLoader />
            ))}
          >
            <For
              each={entries()}
              fallback={<p>No one's added their scores yet :(</p>}
            >
              {([user, record]) => (
                <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 space-y-1">
                  <p class="font-bold text-lg">{user}</p>
                  <p class="text-2xl mb-1">Score: {record.score}</p>
                  <p class="text-sm">
                    {[
                      `${record.daysPlayed} ${plural(
                        record.daysPlayed,
                        'day',
                        'days'
                      )}`,
                      `${record.scorePerDay} avg`,
                      `${record.uncountedFails} uncounted X's`,
                    ].join(' • ')}
                  </p>
                </div>
              )}
            </For>

            <div>
              Sort by:{' '}
              <button
                class="underline"
                onClick={() => {
                  const fields = Object.keys(
                    sortFields
                  ) as (keyof ScoreToRender)[]
                  const currIndex = fields.indexOf(sortOptions().by)
                  const nextIndex = (currIndex + 1) % fields.length
                  setSortOptions(o => ({ ...o, by: fields[nextIndex] }))
                }}
              >
                {sortFields[sortOptions().by]}
              </button>
              {' • '} Order{' '}
              <button
                class="underline"
                onClick={() => setSortOptions(o => ({ ...o, asc: !o.asc }))}
              >
                {sortOptions().asc ? 'ascending' : 'descending'}
              </button>
            </div>
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
