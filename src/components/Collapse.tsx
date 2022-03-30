import { Component, JSX } from 'solid-js'

const Collapse: Component<{ summary: JSX.Element }> = props => {
  return (
    <details class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 space-y-4">
      <summary class="cursor-pointer -my-2 py-2 -mx-4 px-4">
        {props.summary}
      </summary>
      {props.children}
    </details>
  )
}

export default Collapse
