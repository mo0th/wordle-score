import { Component } from 'solid-js'
import { cx } from '../utils/misc'

interface ContainerProps {
  class?: string
}

export const CONTAINER_CLASS = 'max-w-md mx-auto px-8 flex-1 w-full'
const Container: Component<ContainerProps> = props => {
  return <div class={cx(CONTAINER_CLASS, props.class)}>{props.children}</div>
}

export default Container
