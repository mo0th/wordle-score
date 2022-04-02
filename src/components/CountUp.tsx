import {
  Accessor,
  createEffect,
  createSignal,
  JSXElement,
  mergeProps,
  on,
  onCleanup,
} from 'solid-js'
import { toFixedOrLess } from '../utils/misc'

interface CountUpProps {
  start?: number
  to: number
  children?: (count: Accessor<number>) => JSXElement
}

const CountUp = (_props: CountUpProps): JSXElement => {
  const props = mergeProps(
    {
      start: 0,
      step: 1,
      children: (n: Accessor<number>) => <>{toFixedOrLess(n(), 0)}</>,
    },
    _props
  )

  // yoinked from https://github.com/solidjs-community/solid-primitives/blob/main/packages/tween/src/index.ts
  // since using the primitive directly didn't work
  const duration = 500
  const target = () => props.to
  const [start, setStart] = createSignal(document.timeline.currentTime)
  const [current, setCurrent] = createSignal(0)
  createEffect(
    on([target], () => setStart(document.timeline.currentTime), {
      defer: true,
    })
  )
  createEffect(
    on([start, current], () => {
      const cancelId = requestAnimationFrame(t => {
        const elapsed = t - (start() || 0) + 1
        setCurrent(c =>
          elapsed < duration
            ? (target() - c) * (elapsed / duration) + c
            : target()
        )
      })
      onCleanup(() => cancelAnimationFrame(cancelId))
    })
  )

  return props.children(current)
}

export default CountUp
