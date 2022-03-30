import { Link } from 'solid-app-router'
import { Component, createMemo, For, Show } from 'solid-js'
import DayControl from '../components/DayControl'
import { useScoreContext } from '../lib/score-context'
import { getCurrentDayOffset } from '../lib/wordle-stuff'

const Home: Component = () => {
  const [
    { score, record, recordArray, canSync },
    { setDayScore, setTodayScore, deleteDayScore },
  ] = useScoreContext()

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
        <div class="">
          <h2 class="text-2xl mb-8">
            Add Today's Score <span class="text-base">(Day {today})</span>
          </h2>
          <DayControl day={today} onScoreSelect={setTodayScore} isBig />
        </div>
      </Show>

      <div>
        <h2 class="text-2xl mb-8">History</h2>
        <div class="space-y-8">
          <For
            each={recordArray().reverse()}
            fallback={<p>Record a day's score to see your history here</p>}
          >
            {([day, dayScore]) => (
              <div>
                <p class="mb-4 text-xl">{getDayLabel(day)}</p>
                <DayControl
                  day={day}
                  value={dayScore}
                  onScoreSelect={score => setDayScore(day, score)}
                  onDelete={() => deleteDayScore(day)}
                />
              </div>
            )}
          </For>
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
