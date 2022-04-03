import { Component, JSX } from 'solid-js'
import { ChevronRightIcon } from './icons'

const Collapse: Component<{ summary: JSX.Element }> = props => {
  return (
    <details class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 group">
      <summary class="cursor-pointer -my-2 py-2 -mx-4 px-4 focus-outline rounded flex items-center space-x-2 list-none">
        <span class="rotate-0 group-open:rotate-90 transition-transform">
          <ChevronRightIcon class="w-4 h-4" />
        </span>
        <span>{props.summary}</span>
      </summary>
      <div class="space-y-6 pt-6 pb-2">{props.children}</div>
    </details>
  )
}

export default Collapse
