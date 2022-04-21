import { Component, createMemo, createSignal, Show } from 'solid-js'
import { getColorForDayScore, SCORE_GREAT_GLOW } from '~/lib/colors'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
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
  const [settings] = useSettings()

  const open = () => {
    setShowEdit(true)
  }

  const close = () => {
    setShowEdit(false)
    setCurrentScore(props.dayScore as any)
  }

  const showSaveButton = createMemo(() => currentScore() !== props.dayScore)

  return (
    <div id={getDayHistoryItemId(props.day)} class="space-y-4 py-4">
      <p class="flex items-center justify-between text-xl">
        <span>
          {getDayLabel(props.day)} -{' '}
          <span
            class={cx(
              'font-mono text-2xl transition-colors',
              settings.colorScores && getColorForDayScore(props.dayScore),
              settings.glowyNumbers && props.dayScore === 1 && SCORE_GREAT_GLOW
            )}
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
            if (confirm(`Are you sure you want to delete Day ${props.day}?`)) {
              deleteDayScore(props.day)
            }
          }}
        />
        <Show when={showSaveButton()}>
          <Button block onClick={() => setDayScore(props.day, currentScore())}>
            Save Change ({props.dayScore} &rightarrow; {currentScore()})
          </Button>
        </Show>
      </Show>
    </div>
  )
}

export default DayHistoryItem
