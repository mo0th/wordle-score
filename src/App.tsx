import { Component, createEffect, createMemo, For, Show } from 'solid-js'
import DayControl from './components/DayControl'
import Footer from './components/Footer'
import { useScore } from './lib/score-calc'
import { getCurrentDayOffset } from './lib/wordle-stuff'

const getDayLabel = (day: number): string => {
  const today = getCurrentDayOffset()
  if (day === today) return `Today - Day ${day}`
  if (day === today - 1) return `Yesterday - Day ${day}`
  return `Day ${day}`
}

const App: Component = () => {
  const [{ score, record, recordArray }, { setDayScore, setTodayScore }] =
    useScore()

  const today = getCurrentDayOffset()
  const isTodayPending = createMemo(() => !Boolean(record()[today]))

  return (
    <>
      <h1 class="text-5xl text-center mt-8 mb-16">Wordle Score</h1>
      <div class="max-w-sm mx-auto space-y-24 px-8">
        <div class="text-center">
          <h2 className="text-xl">Your score so far</h2>
          <p class="text-8xl font-mono">{score().score}</p>
        </div>

        <Show when={isTodayPending()}>
          <div class="">
            <h2 class="text-2xl mb-8">Add Today's Score</h2>
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
                  />
                </div>
              )}
            </For>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
