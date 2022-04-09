import { Component, ComponentProps, splitProps, mergeProps } from 'solid-js'
import { cx } from '~/utils/misc'

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
        'px-2 py-1 rounded transition-colors focus-outline',
        'bg-gray-300 hover:bg-purple-200 active:bg-purple-300 dark:bg-gray-600 dark:hover:bg-purple-600 dark:active:bg-purple-700',
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
