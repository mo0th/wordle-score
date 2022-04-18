import { Component, createEffect, createMemo, createSignal, on, Show } from 'solid-js'
import { scoreGoodnessTextColors } from '~/lib/colors'
import { useScoreContext } from '~/lib/score-context'
import { SettingsProvider, useSettings } from '~/lib/settings'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'
import { SingleDayScore } from '~/types'
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
  const [settings] = useSettings()

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
    <div id={getDayHistoryItemId(props.day)} class="space-y-4 py-4">
      <p class="flex items-center justify-between text-xl">
        <span>
          {getDayLabel(props.day)} -{' '}
          <span
            class="font-mono text-2xl transition-colors"
            classList={
              settings.colorScores
                ? {
                    'score-great-glow': settings.glowyNumbers && props.dayScore === 1,
                    [scoreGoodnessTextColors.good]: props.dayScore <= 3,
                    [scoreGoodnessTextColors.ok]: props.dayScore > 3 && props.dayScore <= 5,
                    [scoreGoodnessTextColors.bad]: props.dayScore > 5 || props.dayScore === 'X',
                  }
                : {}
            }
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
              props.onHeightChange?.()
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
