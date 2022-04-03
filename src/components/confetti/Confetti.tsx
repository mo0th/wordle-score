import {
  Component,
  createEffect,
  createResource,
  createSignal,
  lazy,
  Show,
} from 'solid-js'
import { useScoreContext } from '../../lib/score-context'
import { cx } from '../../utils/misc'
import Button from '../Button'
import Container from '../Container'
const Particles = lazy(() => import('./Particles'))

let done = false
const Confetti: Component = () => {
  const [{ syncDetails }] = useScoreContext()
  const [show, setShow] = createSignal(false)
  const [shouldConfetti, setShouldConfetti] = createSignal(true)
  const [shouldShowApi] = createResource<
    boolean,
    ReturnType<typeof syncDetails>
  >(syncDetails, async details => {
    try {
      const { ok } = await fetch('/api/bday', {
        method: 'POST',
        body: JSON.stringify({
          user: details.user,
        }),
        headers: {
          Authorization: `Bearer ${details.password}`,
          'Content-Type': 'application/json',
        },
      })
      if (ok) Particles.preload()
      return ok
    } catch (err) {
      return false
    }
  })

  createEffect(() => {
    if (shouldShowApi() && !done) {
      done = true
      setShow(true)
    }
  })

  return (
    <Show when={show()}>
      <div
        class={
          'fixed inset-0 grid place-items-center px-4 bg-black/25 backdrop-blur-sm fade-in z-10'
        }
      >
        <Container class="py-8 rounded bg-gray-200 dark:bg-gray-700 space-y-4">
          <p class="text-5xl sm:text-6xl font-bold font-poppins text-center">
            HAPPY BIRTHDAY
          </p>
          <div class="flex space-x-4">
            <Button onClick={() => setShouldConfetti(p => !p)}>
              {shouldConfetti() ? '🎉' : '😟'}
            </Button>
            <Button
              block
              onClick={() => {
                setShow(false)
              }}
            >
              k
            </Button>
          </div>
        </Container>
      </div>
      <Show when={shouldConfetti()}>
        <Particles class="fade-in" />
      </Show>
    </Show>
  )
}

export default Confetti
