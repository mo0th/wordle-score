import { Link } from 'solid-app-router'
import { Component, createMemo, createSignal, For, Show } from 'solid-js'
import Button from '../components/Button'
import Collapse from '../components/Collapse'
import DayControl from '../components/DayControl'
import { useScoreContext } from '../lib/score-context'
import { getCurrentDayOffset } from '../lib/wordle-stuff'

const NUM_RECORDS_BEFORE_HIDING = 3

const Home: Component = () => {
  const [
    { score, record, recordArray, canSync },
    { setDayScore, setTodayScore, deleteDayScore },
  ] = useScoreContext()

  const today = getCurrentDayOffset()
  const isTodayPending = createMemo(() => !Boolean(record()[today]))

  const [showAll, setShowAll] = createSignal(false)
  const recordsLength = createMemo(() => recordArray().length)
  const recordsToShow = createMemo(() => {
    const records = [...recordArray()].reverse()
    if (!showAll()) {
      return records.slice(0, NUM_RECORDS_BEFORE_HIDING)
    }
    return records
  })

  return (
    <>
      <div class="text-center">
        <h2 className="text-xl">Your score so far</h2>
        <p class="text-8xl font-mono">{score().score}</p>

        <Show when={canSync()}>
          <p>
            <Link href="/scores" class="underline">
              See other people's scores
            </Link>
          </p>
        </Show>
      </div>

      <Show when={isTodayPending()}>
        <div id="current-day-wrapper">
          <h2 class="text-2xl mb-8">
            Add Today's Score <span class="text-base">(Day {today})</span>
          </h2>
          <DayControl day={today} onScoreSelect={setTodayScore} isBig />
        </div>
      </Show>

      <div>
        <div class="mb-2 flex item-center">
          <h2 class="text-2xl">History</h2>
        </div>
        <div class="space-y-8">
          <For
            each={recordsToShow()}
            fallback={<p>Record a day's score to see your history here</p>}
          >
            {([day, dayScore]) => (
              <div id={getDayWrapperId(day)}>
                <p class="mb-4 text-xl">{getDayLabel(day)}</p>
                <DayControl
                  day={day}
                  value={dayScore}
                  onScoreSelect={score => {
                    setDayScore(day, score)
                  }}
                  onDelete={() => {
                    if (
                      confirm(`Are you sure you want to delete Day ${day}?`)
                    ) {
                      deleteDayScore(day)
                    }
                  }}
                />
              </div>
            )}
          </For>
          <Show when={recordsLength() > NUM_RECORDS_BEFORE_HIDING}>
            <Button
              onClick={() => setShowAll(p => !p)}
              block
              classList={{
                'sticky bottom-4': showAll(),
              }}
            >
              {showAll()
                ? `Show Top ${NUM_RECORDS_BEFORE_HIDING}`
                : `Show All (${recordsLength()})`}
            </Button>
          </Show>

          <AddDay
            onAdd={day => {
              if (day > getCurrentDayOffset()) return
              if (record()[day]) {
                const id = getDayWrapperId(day)
                let el = document.getElementById(id)
                if (!el) {
                  setShowAll(true)
                  el = document.getElementById(id)
                }
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                }
                return
              }
              setDayScore(day, 'X')
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Home

const getDayLabel = (day: number): string => {
  const today = getCurrentDayOffset()
  if (day === today) return `Today - Day ${day}`
  if (day === today - 1) return `Yesterday - Day ${day}`
  return `Day ${day}`
}

const getDayWrapperId = (day: number) => `day-${day}-wrapper`

export const AddDay: Component<{ onAdd?: (day: number) => void }> = props => {
  let input: HTMLInputElement | undefined

  const handleAdd = () => {
    const day = input?.valueAsNumber
    if (!day || typeof day !== 'number' || Number.isNaN(day)) return
    props.onAdd?.(day)
  }

  return (
    <div class="space-y-4 rounded bg-gray-200 dark:bg-gray-700 p-4">
      <label for="day-to-add">Add an older day</label>
      <div class="flex items-stretch space-x-4">
        <input
          ref={input}
          class="form-input flex-1 block w-full"
          type="number"
          id="day-to-add"
          min={1}
          // @ts-expect-error no types for solid's attr:__ yet
          attr:value={getCurrentDayOffset() - 1}
          max={getCurrentDayOffset() - 1}
        />
        <Button onClick={handleAdd} class="flex-shrink-0">
          Add Day
        </Button>
      </div>
    </div>
  )
}
