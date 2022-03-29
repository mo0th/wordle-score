import { Component, createMemo, For } from 'solid-js'
import { SingleDayScore } from '../types'

export const getInputNameForDay = (day: number) => `day-${day}-score`

const DayControlButton: Component<{
  onClick?: () => void
  selected: boolean
  name: string
  value: SingleDayScore
}> = props => (
  <label class="block aspect-w-1 aspect-h-1 w-full">
    <input
      checked={props.selected}
      name={props.name}
      value={props.value}
      type="radio"
      class="sr-only"
    />
    <span
      class={
        'border-2 border-slate-400 flex-shrink-0 transition-colors flex items-center justify-center cursor-pointer'
      }
      classList={{
        'bg-slate-800 text-white hover:bg-black': props.selected,
        'hover:bg-slate-300': !props.selected,
      }}
      onClick={props.onClick}
    >
      {props.value}
    </span>
  </label>
)

const scores: SingleDayScore[] = [1, 2, 3, 4, 5, 6, 'X']

const DayControl: Component<{
  day: number
  value?: SingleDayScore | undefined | null
  onScoreSelect(score: SingleDayScore): void
  isBig?: boolean
}> = props => {
  const inputName = createMemo(() => getInputNameForDay(props.day))

  return (
    <div
      class="grid gap-4 justify-between justify-items-center font-mono"
      classList={{
        'grid-cols-4 text-5xl': !props.isBig,
        'grid-cols-3 text-6xl': props.isBig,
      }}
    >
      <For each={scores}>
        {item => (
          <DayControlButton
            selected={item === props.value}
            onClick={() => props.onScoreSelect(item)}
            name={inputName()}
            value={item}
          />
        )}
      </For>
    </div>
  )
}

export default DayControl
