import { Component } from 'solid-js'
import { cx } from '../utils/misc'

interface ContainerProps {
  class?: string
}

const Container: Component<ContainerProps> = props => {
  return (
    <div class={cx('max-w-md mx-auto px-8 flex-1 w-full', props.class)}>
      {props.children}
    </div>
  )
}

export default Container
