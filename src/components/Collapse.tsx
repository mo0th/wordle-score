import { Component, JSX } from 'solid-js'

const Collapse: Component<{ summary: JSX.Element }> = props => {
  return (
    <details class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">
      <summary class="cursor-pointer -my-2 py-2 -mx-4 px-4 focus-outline rounded">
        {props.summary}
      </summary>
      <div class="space-y-6 pt-6 pb-2">{props.children}</div>
    </details>
  )
}

export default Collapse
