import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import { cx, toggle } from '~/utils/misc'
import Container from './Container'

const classes = {
  bg: 'bg-purple-200 dark:bg-purple-800',
}

const DevOverlay: Component = () => {
  const [show, setShow] = createSignal(false)
  return (
    <div
      class="fixed inset-x-0 bottom-0 !m-0 transition-transform"
      style={{ transform: show() ? '' : 'translateY(calc(100% - 2rem))' }}
    >
      <Container>
        <div class="">
          <button
            class={cx(
              classes.bg,
              'transition-colors hover:bg-purple-300 dark:hover:bg-purple-700',
              'rounded-t px-2 py-1 font-mono'
            )}
            onClick={() => setShow(toggle)}
          >
            {'</>'}
          </button>
        </div>
        <div class={cx(classes.bg, 'p-4')}>
          <WindowSize />
        </div>
      </Container>
    </div>
  )
}

const WindowSize = () => {
  const [size, setSize] = createSignal({ width: window.innerWidth, height: window.innerHeight })

  createEffect(() => {
    const handle = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handle)
    onCleanup(() => window.removeEventListener('resize', handle))
  })

  return (
    <div class="flex justify-between">
      <p>Window Size</p>
      <p class="font-mono">
        {size().width} x {size().height}
      </p>
    </div>
  )
}

export default DevOverlay
