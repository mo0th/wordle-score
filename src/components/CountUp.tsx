import {
  Accessor,
  createEffect,
  createSignal,
  JSXElement,
  mergeProps,
  on,
  onCleanup,
} from 'solid-js'
import { useSettings } from '~/lib/settings'
import { toFixedOrLess } from '~/utils/misc'

interface CountUpProps {
  start?: number
  to: number
  duration?: number
  children?: (count: Accessor<number>) => JSXElement
}

const easeLinear = (t: number) => t
const easeCos = (t: number) => 1 - (Math.cos(Math.PI * t) + 1) / 2
const ease2 = (t: number) => {
  t /= 0.5
  if (t < 1) return 0.5 * t * t
  t--
  return -0.5 * (t * (t - 2) - 1)
}
const ease3 = (t: number) => (t > 0.5 ? 4 * Math.pow(t - 1, 3) + 1 : 4 * Math.pow(t, 3))

const ease4 = (t: number) =>
  t < 0.5 ? +8.0 * Math.pow(t, 4.0) : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0

const ease5 = (t: number) => {
  if ((t *= 2) < 1) return 0.5 * t * t * t * t * t
  return 0.5 * ((t -= 2) * t * t * t * t + 2)
}

const CountUp = (_props: CountUpProps): JSXElement => {
  const props = mergeProps(
    {
      start: 0,
      step: 1,
      duration: 2500,
      children: (n: Accessor<number>) => <>{toFixedOrLess(n(), 0)}</>,
    },
    _props
  )
  const [settings] = useSettings()

  // yoinked from https://github.com/solidjs-community/solid-primitives/blob/main/packages/tween/src/index.ts
  // since using the primitive directly didn't work
  const target = () => props.to
  const [start, setStart] = createSignal(document.timeline.currentTime)
  const [current, setCurrent] = createSignal(settings.animatedCounts ? 0 : props.to)

  createEffect(() => {
    if (!settings.animatedCounts) {
      setCurrent(target())
      return
    }

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
            elapsed < props.duration
              ? (target() - c) * ease2(elapsed / props.duration) + c
              : target()
          )
        })
        onCleanup(() => cancelAnimationFrame(cancelId))
      })
    )
  })

  return <>{props.children(current)}</>
}

export default CountUp
