import { Component, ComponentProps, splitProps, mergeProps } from 'solid-js'
import { cx } from '../utils/misc'

const Button: Component<
  ComponentProps<'button'> & { block?: boolean }
> = _props => {
  const [local, delegated] = splitProps(
    mergeProps({ block: false, type: 'button' }, _props),
    ['block', 'class']
  )

  return (
    <button
      class={cx(
        'px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors focus-outline',
        local.class
      )}
      classList={{
        'block w-full': local.block,
      }}
      {...delegated}
    />
  )
}

export default Button
