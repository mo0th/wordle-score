import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  Show,
} from 'solid-js'
import { useScoreContext } from '../lib/score-context'
import { getCurrentDayOffset } from '../lib/wordle-stuff'
import { SingleDayScore } from '../types'
import Button from './Button'
import DayControl from './DayControl'

export const getDayLabel = (day: number): string => {
  const today = getCurrentDayOffset()
  if (day === today) return `Today - Day ${day}`
  if (day === today - 1) return `Yesterday - Day ${day}`
  return `Day ${day}`
}

export const getDayHistoryItemId = (day: number) => `day-${day}-wrapper`

const DayHistoryItem: Component<{
  day: number
  dayScore: SingleDayScore
  onHeightChange?: () => void
}> = props => {
  const [, { setDayScore, deleteDayScore }] = useScoreContext()
  const [showEdit, setShowEdit] = createSignal(false)
  const [currentScore, setCurrentScore] = createSignal(props.dayScore)

  const open = () => {
    setShowEdit(true)
  }

  const close = () => {
    setShowEdit(false)
    setCurrentScore(props.dayScore as any)
  }

  const showSaveButton = createMemo(() => currentScore() !== props.dayScore)

  createEffect(
    on(
      [showSaveButton, showEdit],
      () => {
        props.onHeightChange?.()
      },
      { defer: true }
    )
  )

  return (
    <div id={getDayHistoryItemId(props.day)} class="py-4 space-y-4">
      <p class="text-xl justify-between flex items-center">
        <span>{getDayLabel(props.day)}</span>
        <Button onClick={() => (showEdit() ? close() : open())}>
          {showEdit() ? 'cancel' : 'edit'}
        </Button>
      </p>
      <Show when={showEdit()}>
        <DayControl
          day={props.day}
          value={currentScore()}
          onScoreSelect={score => setCurrentScore(score as any)}
          onDelete={() => {
            if (confirm(`Are you sure you want to delete Day ${props.day}?`)) {
              deleteDayScore(props.day)
            }
          }}
        />
        <Show when={showSaveButton()}>
          <Button block onClick={() => setDayScore(props.day, currentScore())}>
            Save Change ({props.dayScore} -&gt; {currentScore()})
          </Button>
        </Show>
      </Show>
    </div>
  )
}

export default DayHistoryItem
