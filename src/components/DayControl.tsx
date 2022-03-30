import { Component, For, mergeProps, Show } from 'solid-js'
import { SingleDayScore } from '../types'

export const getInputNameForDay = (day: number) => `day-${day}-score`

const DayControlButton: Component<{
  onClick?: () => void
  selected: boolean
  variant?: 'red' | 'base'
}> = _props => {
  const props = mergeProps({ variant: 'base' }, _props)
  return (
    <span class="block aspect-w-1 aspect-h-1 w-full focus-within-outline">
      <button
        class={
          'border-2 border-slate-400 flex-shrink-0 transition flex items-center justify-center cursor-pointer'
        }
        classList={{
          'bg-slate-800 text-white hover:bg-black dark:hover:bg-white dark:bg-slate-200 dark:text-black':
            props.selected,
          'hover:bg-red-200 dark:hover:bg-red-700':
            !props.selected && props.variant === 'red',
          'hover:bg-slate-300 dark:hover:bg-slate-600':
            !props.selected && props.variant === 'base',
        }}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </span>
  )
}

const scores: SingleDayScore[] = [1, 2, 3, 4, 5, 6, 'X']

const DayControl: Component<{
  day: number
  value?: SingleDayScore | undefined | null
  onScoreSelect(score: SingleDayScore): void
  onDelete?: () => void
  isBig?: boolean
}> = props => {
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
            children={item}
          />
        )}
      </For>
      <Show when={Boolean(props.onDelete)}>
        <DayControlButton
          variant="red"
          selected={false}
          onClick={() => props.onDelete?.()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width={2}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </DayControlButton>
      </Show>
    </div>
  )
}

export default DayControl
