import { Link } from 'solid-app-router'
import { Component, createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import Button from '~/components/Button'
import CountUp from '~/components/CountUp'
import DayControl from '~/components/DayControl'
import DayHistoryItem, { getDayHistoryItemId } from '~/components/DayHistoryItem'
import ReadScoreFromClipboard from '~/components/ReadScoreFromClipboard'
import SecondaryScoreDetails from '~/components/SecondaryScoreDetails'
import { personScoreToRenderData } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { settings, useSettings } from '~/lib/settings'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'
import { formatScoreNumber, toggle as _toggle } from '~/utils/misc'

const NUM_RECORDS_BEFORE_HIDING = 3

const CURRENT_DAY_INPUT_ID = 'current-day-wrapper'

const Home: Component = () => {
  const [{ score, record, canSync }, { setTodayScore }] = useScoreContext()
  const [settings] = useSettings()

  const today = getCurrentDayOffset()
  const isTodayPending = createMemo(() => !Boolean(record()[today]))

  return (
    <>
      <Show when={score().daysPlayed > 0}>
        <div class="space-y-2 text-center">
          <h2 className="text-xl">Your score so far</h2>
          <p class="font-mono">
            <CountUp to={score().score}>
              {c => {
                const formatted = formatScoreNumber(c(), {
                  shortenBigNumbers: settings.shortenBigNumbers,
                })
                const textsize = (() => {
                  const len = formatted.length
                  if (len < 7) return 'text-8xl'
                  if (len < 9) return 'text-7xl'
                  if (len < 11) return 'text-6xl'
                  if (len < 13) return 'text-5xl'
                  if (len < 15) return 'text-4xl'
                  if (len < 17) return 'text-3xl'
                  return 'text-2xl'
                })()
                return <span class={textsize}>{formatted}</span>
              }}
            </CountUp>
          </p>
          <SecondaryScoreDetails record={personScoreToRenderData(score())} />
          <Show when={canSync()}>
            <p>
              <Link href="/scores" class="link px-2">
                See other people's scores
              </Link>
            </p>
          </Show>
        </div>
      </Show>

      <Show when={isTodayPending()}>
        <div id={CURRENT_DAY_INPUT_ID} class="scroll-m-8 space-y-6">
          <h2 class="text-2xl">
            Add Today's Score <span class="text-base">(Day {today})</span>
          </h2>
          <ReadScoreFromClipboard />
          <DayControl day={today} onScoreSelect={setTodayScore} isBig />
        </div>
      </Show>

      <ScoreHistory />
    </>
  )
}

export default Home

const ScoreHistory: Component = () => {
  const [{ recordArray, record }, { setDayScore }] = useScoreContext()

  const [showAll, setShowAll] = createSignal(false)
  const recordsLength = createMemo(() => recordArray().length)
  const recordsToShow = createMemo(() => {
    const records = [...recordArray()].reverse()
    if (showAll()) {
      return records
    }
    return records.slice(0, NUM_RECORDS_BEFORE_HIDING)
  })

  const toggle = () => {
    setShowAll(_toggle)
  }

  createEffect(() => {
    if (recordsLength() <= NUM_RECORDS_BEFORE_HIDING) {
      setShowAll(false)
    }
  })

  return (
    <div class="space-y-8">
      <h2 class="text-2xl">History</h2>
      <div class="space-y-4">
        <div class="-mx-4 divide-y-2 divide-gray-300 overflow-x-visible px-4 ease-in-out dark:divide-gray-700">
          <For
            each={recordsToShow()}
            fallback={<p>Record a day's score to see your history here</p>}
          >
            {([day, dayScore]) => <DayHistoryItem day={day} dayScore={dayScore} />}
          </For>
        </div>
        <Show when={recordsLength() > NUM_RECORDS_BEFORE_HIDING}>
          <Button
            onClick={toggle}
            block
            style="transition: bottom 150ms ease-in-out"
            classList={{
              sticky: showAll(),
              'bottom-6': showAll() && !settings.devStuff,
              'bottom-10': showAll() && settings.devStuff,
            }}
          >
            {showAll() ? `Show Top ${NUM_RECORDS_BEFORE_HIDING}` : `Show All (${recordsLength()})`}
          </Button>
        </Show>

        <AddOrFindDay
          onAdd={day => {
            const curr = getCurrentDayOffset()
            if (day > curr) return
            if (day !== curr && !record()[day]) {
              setDayScore(day, 'X')
            }
            const id =
              day === curr && !record()[day] ? CURRENT_DAY_INPUT_ID : getDayHistoryItemId(day)
            let el = document.getElementById(id)
            if (!el) {
              setShowAll(true)
              el = document.getElementById(id)
            }
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <div class="text-center">
          <Link class="link px-2" href="/stats">
            Stats
          </Link>
        </div>
      </div>
    </div>
  )
}

const AddOrFindDay: Component<{ onAdd?: (day: number) => void }> = props => {
  let input: HTMLInputElement | undefined

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        const day = input?.valueAsNumber
        if (!day || typeof day !== 'number' || Number.isNaN(day)) return
        props.onAdd?.(day)
      }}
      class="space-y-4 rounded bg-gray-200 p-4 dark:bg-gray-700"
    >
      <label for="day-to-add">Add / find an older day</label>
      <div class="flex items-stretch space-x-4">
        <input
          ref={input}
          class="form-input block w-full flex-1 appearance-none"
          type="number"
          id="day-to-add"
          min={1}
          // @ts-expect-error no types for solid's attr:__ yet
          attr:value={getCurrentDayOffset()}
          max={getCurrentDayOffset()}
        />
        <Button type="submit" class="flex-shrink-0">
          Add / find day
        </Button>
      </div>
    </form>
  )
}
