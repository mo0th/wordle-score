import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  JSXElement,
  mergeProps,
  onCleanup,
} from 'solid-js'

interface CountUpProps {
  start?: number
  step?: number
  to: number
  render?: (count: Accessor<number>) => JSXElement
}

const CountUp: Component<CountUpProps> = _props => {
  const props = mergeProps(
    { start: 0, step: 1, render: (n: number) => [n] },
    _props
  )
  const [current, setCurrent] = createSignal(props.start)

  const ERR = props.step * 0.5001

  createEffect(() => {
    let timeout: NodeJS.Timeout

    const loop = () => {
      let done = false
      setCurrent(c => {
        if (Math.abs(props.to - c) <= ERR) {
          done = true
          return props.to
        }

        if (props.to > c) {
          return c + props.step
        } else {
          return c - props.step
        }
      })

      if (!done) {
        timeout = setTimeout(loop)
      }
    }

    loop()

    onCleanup(() => {
      clearTimeout(timeout)
    })
  })

  return props.render(current)
}

export default CountUp
