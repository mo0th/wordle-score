import { Link } from 'solid-app-router'
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
} from 'solid-js'
import Button from '../components/Button'
import DayControl from '../components/DayControl'
import DayHistoryItem, {
  getDayHistoryItemId,
} from '../components/DayHistoryItem'
import ReadScoreFromClipboard from '../components/ReadScoreFromClipboard'
import { useScoreContext } from '../lib/score-context'
import { getCurrentDayOffset } from '../lib/wordle-stuff'

const NUM_RECORDS_BEFORE_HIDING = 3

const Home: Component = () => {
  const [{ score, record, canSync }, { setTodayScore }] = useScoreContext()

  const today = getCurrentDayOffset()
  const isTodayPending = createMemo(() => !Boolean(record()[today]))

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
        <div id="current-day-wrapper" class="space-y-4">
          <h2 class="text-2xl mb-8">
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
  const [animating, setAnimating] = createSignal(false)
  const recordsToShow = createMemo(() => {
    const records = [...recordArray()].reverse()
    if (animating() || showAll()) {
      return records
    }
    return records.slice(0, NUM_RECORDS_BEFORE_HIDING)
  })

  let wrapper: HTMLDivElement | undefined
  let timeout: NodeJS.Timeout

  const toggle = () => {
    if (showAll()) {
      setShowAll(false)
    } else {
      setShowAll(true)
    }
  }

  createEffect(() => {
    if (timeout) clearTimeout(timeout)
    if (!wrapper) return
    showAll()

    let startHeight = wrapper.offsetHeight
    let endHeight: number

    wrapper!.style.height = 'auto'
    endHeight = wrapper!.offsetHeight
    wrapper!.style.height = `${startHeight}px`

    const duration = Math.round(
      Math.log2(Math.abs(startHeight - endHeight) * 2) * 100
    )
    wrapper!.style.transitionDuration = `${duration}ms`

    requestAnimationFrame(() => {
      setAnimating(true)
      if (wrapper?.style?.height) {
        wrapper.style.height = `${endHeight}px`
      }
      timeout = setTimeout(() => setAnimating(false), duration)
    })
  })

  return (
    <div>
      <h2 class="text-2xl mb-8">History</h2>
      <div class="space-y-4">
        <div
          class="divide-y-2 divide-gray-300 dark:divide-gray-700 overflow-y-hidden ease-in-out"
          ref={wrapper}
          style={{
            'transition-property': 'height',
            outline: '1px solid red',
            'outline-offset': '-1px',
          }}
        >
          <For
            each={recordsToShow()}
            fallback={<p>Record a day's score to see your history here</p>}
          >
            {([day, dayScore]) => (
              <DayHistoryItem day={day} dayScore={dayScore} />
            )}
          </For>
        </div>
        <Show when={recordsLength() > NUM_RECORDS_BEFORE_HIDING}>
          <Button
            onClick={toggle}
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
              const id = getDayHistoryItemId(day)
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
  )
}

const AddDay: Component<{ onAdd?: (day: number) => void }> = props => {
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
