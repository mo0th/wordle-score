import { Component, ComponentProps, splitProps, mergeProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cx } from '~/utils/misc'

const Button: Component<ComponentProps<'button'> & { block?: boolean; as?: string }> = _props => {
  const [local, delegated] = splitProps(
    mergeProps({ block: false, type: 'button', as: 'button' }, _props),
    ['block', 'class', 'as']
  )

  return (
    <Dynamic
      component={local.as}
      class={cx(
        'focus-outline focus-within-ouline cursor-pointer rounded px-2 py-1 text-center transition-colors',
        'bg-gray-300 dark:bg-gray-600',
        delegated.disabled
          ? 'cursor-not-allowed text-gray-600 dark:text-gray-300'
          : 'hover:bg-purple-200 active:bg-purple-300 dark:hover:bg-purple-600 dark:active:bg-purple-700',
        local.block && 'block w-full',
        local.class
      )}
      {...delegated}
    />
  )
}

export default Button
