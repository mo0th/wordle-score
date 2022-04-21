import { Link, Navigate } from 'solid-app-router'
import { onMount } from 'solid-js'
import { Component, createMemo, For, Show } from 'solid-js'
import CountUp from '~/components/CountUp'
import SecondaryScoreDetails from '~/components/SecondaryScoreDetails'
import { personScoreToRenderData, ScoreRenderData } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { PersonScore } from '~/types'
import { formatNumberTo2DP, toggle } from '~/utils/misc'
import { useLocalStorageStore } from '~/utils/use-local-storage'

const scoreLoaderClassCommon = 'mx-auto bg-gray-400 dark:bg-gray-500 rounded animate-pulse'
const ScoreLoader: Component = () => (
  <div class="space-y-1 rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
    <div class={`h-7 ${scoreLoaderClassCommon}`} style="width:100px" />
    <div class={`h-8 ${scoreLoaderClassCommon}`} style="width: 150px" />
    <div class={`h-5 ${scoreLoaderClassCommon}`} style="width: 250px" />
  </div>
)

const sortFields: Record<Exclude<keyof ScoreRenderData, 'record'>, string> = {
  daysPlayed: 'Days Played',
  score: 'Score',
  scorePerDay: 'Average Score',
  uncountedFails: 'Uncounted Fails',
}

const Scores: Component = () => {
  const [settings] = useSettings()
  const [{ canSync, allScores, syncDetails }, { refetchAllScores }] = useScoreContext()
  const [sortOptions, setSortOptions] = useLocalStorageStore<{
    asc: boolean
    by: keyof typeof sortFields
  }>('mooth:wordle-score-sorting', { asc: true, by: 'scorePerDay' })

  onMount(() => refetchAllScores())

  const unsortedEntries = createMemo(() =>
    (Object.entries(allScores() || {}) as [string, PersonScore][]).map(
      ([name, record]) => [name, personScoreToRenderData(record)] as [string, ScoreRenderData]
    )
  )
  const entries = createMemo(() => {
    const field = sortOptions.by
    const sorted = unsortedEntries().sort(([nameA, a], [nameB, b]) => {
      const diff = (a[field] - b[field]) * (sortOptions.asc ? 1 : -1)
      if (diff !== 0) return diff
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase())
    })

    if (!settings.devStuff) {
      return sorted.filter(([name]) => !name.endsWith('-testing') || name === syncDetails().user)
    }

    return sorted
  })

  return (
    <Show when={canSync()} fallback={<Navigate href="/" />}>
      <div class="space-y-8 text-center">
        <h2 class="mb-8 text-2xl">Other People's Scores</h2>
        <div class="space-y-4">
          <Show
            when={Boolean(allScores())}
            fallback={Array.from({ length: 4 }, () => (
              <ScoreLoader />
            ))}
          >
            <For each={entries()} fallback={<p>No one's added their scores yet :(</p>}>
              {([user, record]) => {
                return (
                  <div class="space-y-1 rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
                    <p class="text-lg font-bold">{user}</p>
                    <p class="mb-1 text-2xl">
                      Score:{' '}
                      <span class="font-mono">
                        <CountUp to={record.score} children={c => formatNumberTo2DP(c())} />
                      </span>
                    </p>
                    <SecondaryScoreDetails record={record} />
                  </div>
                )
              }}
            </For>

            <div>
              Sort by{' '}
              <button
                class="link px-1"
                onClick={() => {
                  const fields = Object.keys(sortFields) as (keyof typeof sortFields)[]
                  const currIndex = fields.indexOf(sortOptions.by)
                  const nextIndex = (currIndex + 1) % fields.length
                  setSortOptions('by', fields[nextIndex])
                }}
              >
                {sortFields[sortOptions.by]}
              </button>
              {' • '}Order{' '}
              <button class="link px-1" onClick={() => setSortOptions('asc', toggle)}>
                {sortOptions.asc ? 'ascending' : 'descending'}
              </button>
            </div>
          </Show>
        </div>

        <div>
          <Link class="link px-2" href="/">
            Go Home
          </Link>
        </div>
      </div>
    </Show>
  )
}

export default Scores
