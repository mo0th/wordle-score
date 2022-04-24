import { Component, createMemo, createSignal, Show } from 'solid-js'
import { getClassesForScore } from '~/lib/colors'
import { useScoreContext } from '~/lib/score-context'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'
import { SingleDayScore } from '~/types'
import { cx } from '~/utils/misc'
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
}> = props => {
  const [, { setDayScore, deleteDayScore }] = useScoreContext()
  const [showEdit, setShowEdit] = createSignal(false)
  const [currentScore, setCurrentScore] = createSignal(props.dayScore)
  const [isDelete, setIsDelete] = createSignal(false)

  const open = () => {
    setShowEdit(true)
  }

  const close = () => {
    setShowEdit(false)
    setCurrentScore(props.dayScore as any)
  }

  const showSaveEditButton = createMemo(() => !isDelete() && currentScore() !== props.dayScore)

  return (
    <div id={getDayHistoryItemId(props.day)} class="space-y-4 py-4">
      <p class="flex items-center justify-between text-xl">
        <span>
          {getDayLabel(props.day)} -{' '}
          <span
            class={cx('font-mono text-2xl transition-colors', getClassesForScore(props.dayScore))}
          >
            {props.dayScore}
          </span>
        </span>
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
            setIsDelete(true)
          }}
        />
        <Show when={isDelete()}>
          <Button block onClick={() => deleteDayScore(props.day)}>
            Delete Day {props.day}
          </Button>
        </Show>
        <Show when={showSaveEditButton()}>
          <Button block onClick={() => setDayScore(props.day, currentScore())}>
            Save Change ({props.dayScore} &rightarrow; {currentScore()})
          </Button>
        </Show>
      </Show>
    </div>
  )
}

export default DayHistoryItem
