import { Component, ComponentProps, splitProps, mergeProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cx } from '~/utils/misc'

const Button: Component<
  ComponentProps<'button'> & { block?: boolean; active?: boolean; as?: string }
> = _props => {
  const [local, delegated] = splitProps(
    mergeProps({ block: false, type: 'button', as: 'button', active: false }, _props),
    ['block', 'class', 'as', 'active']
  )

  return (
    <Dynamic
      component={local.as}
      class={cx(
        'focus-outline focus-within-ouline cursor-pointer rounded bg-gray-300 px-2 py-1 text-center transition-colors dark:bg-gray-600',
        ...Object.entries({
          'block w-full': local.block,
          'cursor-not-allowed text-gray-600 dark:text-gray-300': delegated.disabled,
          'hover:bg-purple-200 active:bg-purple-300 dark:hover:bg-purple-600 dark:active:bg-purple-700':
            !delegated.disabled,
        }).map(([cls, cond]) => cond && cls),
        local.class
      )}
      data-active={local.active || undefined}
      {...delegated}
    />
  )
}

export default Button
