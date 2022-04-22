import { Component, JSX } from 'solid-js'
import { cx } from '~/utils/misc'
import { ChevronRightIcon } from './icons'

const Collapse: Component<{ summary: JSX.Element; defaultOpen?: boolean }> = props => {
  return (
    <details
      class="details rounded bg-gray-200 px-4 py-2 dark:bg-gray-700"
      open={props.defaultOpen}
    >
      <summary
        class={cx(
          'focus-outline -my-2 -mx-4 flex cursor-pointer list-none items-center space-x-2 rounded py-2 px-4 transition-colors',
          'bg-transparent hover:bg-purple-100 active:bg-purple-200 dark:hover:bg-purple-700 dark:active:bg-purple-800'
        )}
      >
        <span class="details-icon rotate-0 transition-transform">
          <ChevronRightIcon class="h-4 w-4" />
        </span>
        <span>{props.summary}</span>
      </summary>
      <div class="space-y-6 pt-6 pb-2">{props.children}</div>
    </details>
  )
}

export default Collapse
