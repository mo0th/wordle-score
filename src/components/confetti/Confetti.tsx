import { Component, createEffect, createResource, createSignal, lazy, Show } from 'solid-js'
import { useScoreContext } from '~/lib/score-context'
import { toggle } from '~/utils/misc'
import Button from '~/components/Button'
import Container from '~/components/Container'
import '~/styles/confetti.css'

const Particles = lazy(() => import('./Particles'))

let done = false
const Confetti: Component = () => {
  const [{ syncDetails }] = useScoreContext()
  const [show, setShow] = createSignal(false)
  const [shouldConfetti, setShouldConfetti] = createSignal(true)
  const [shouldShowApi] = createResource<boolean, ReturnType<typeof syncDetails>>(
    syncDetails,
    async details => {
      if (!details.user || !details.password) return false
      try {
        const { ok, headers } = await fetch('/api/bday', {
          method: 'POST',
          body: JSON.stringify({
            user: details.user,
          }),
          headers: {
            Authorization: `Bearer ${details.password}`,
            'Content-Type': 'application/json',
          },
        })

        return ok && !headers.get('content-type')?.includes('html')
      } catch (err) {
        return false
      }
    }
  )

  createEffect(() => {
    if (shouldShowApi() && !done) {
      done = true
      setShow(true)
    }
  })

  createEffect(() => {
    if (show()) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  })

  return (
    <Show when={show()}>
      <div
        class={
          'fade-in fixed inset-0 z-10 grid place-items-center bg-black/25 px-4 backdrop-blur-sm'
        }
      >
        <Container class="space-y-4 rounded bg-gray-200 py-8 dark:bg-gray-700">
          <p class="text-center font-poppins text-5xl font-bold sm:text-6xl">HAPPY BIRTHDAY</p>
          <div class="flex space-x-4">
            <Button onClick={() => setShouldConfetti(toggle)}>
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
