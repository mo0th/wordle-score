import { Navigate } from 'solid-app-router'
import { onMount } from 'solid-js'
import { Component, createMemo, For, Show } from 'solid-js'
import CountUp from '~/components/CountUp'
import { CheckCircleIcon } from '~/components/icons'
import SecondaryScoreDetails from '~/components/SecondaryScoreDetails'
import NotHomePageLayout from '~/layouts/NotHomePageLayout'
import { scoreGoodnessTextColors } from '~/lib/colors'
import { personScoreToRenderData, ScoreRenderData } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'
import { PersonScore } from '~/types'
import { cx, formatScoreNumber, toggle } from '~/utils/misc'
import { useLocalStorageStore } from '~/utils/use-local-storage'

const scoreLoaderClassCommon = 'mx-auto bg-gray-400 dark:bg-gray-500 rounded animate-pulse'
const ScoreLoader: Component = () => (
  <div class="space-y-1 rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
    <div class={`h-7 ${scoreLoaderClassCommon}`} style="width:100px" />
    <div class={`h-8 ${scoreLoaderClassCommon}`} style="width: 150px" />
    <div class={`h-5 ${scoreLoaderClassCommon}`} style="width: 250px" />
  </div>
)

const sortFields: Record<
  Exclude<keyof ScoreRenderData, 'record' | 'mostRecentlyPlayed'>,
  string
> = {
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

  const syncUser = createMemo(() => syncDetails().user)

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

    if (!(settings.devStuff && settings.showTestingUsers)) {
      return sorted.filter(([name]) => !name.endsWith('-testing') || name === syncUser())
    }

    return sorted
  })

  const currDay = getCurrentDayOffset()

  return (
    <Show when={canSync()} fallback={<Navigate href="/" />}>
      <NotHomePageLayout title="Other People's Scores">
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
                  <div class="relative space-y-1 rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
                    <p class="text-lg font-bold">{user}</p>
                    <p class="mb-1 text-2xl">
                      Score:{' '}
                      <span class="font-mono">
                        <CountUp
                          to={record.score}
                          children={c =>
                            formatScoreNumber(c(), {
                              shortenBigNumbers: settings.shortenBigNumbers,
                            })
                          }
                        />
                      </span>
                    </p>
                    <SecondaryScoreDetails record={record} />
                    <Show
                      when={settings.showDoneCheckmark && currDay === record.mostRecentlyPlayed}
                    >
                      <span class="group absolute top-4 right-4 !mt-0 text-purple-700 dark:text-purple-300">
                        <CheckCircleIcon class="h-5 w-5" />
                        <span
                          class={`pointer-events-none absolute -right-2 block w-64 -translate-y-4 rounded bg-gray-300 p-2 text-left opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-600`}
                          style="max-width: calc(100vw-4rem); top: 1.5rem"
                        >
                          {`${
                            syncUser() === user ? "You've" : `${user} has`
                          } completed today (day ${currDay})`}
                        </span>
                      </span>
                    </Show>
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
      </NotHomePageLayout>
    </Show>
  )
}

export default Scores
