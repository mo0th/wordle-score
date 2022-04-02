type UseResizeContainerProps = {
  ref: () => HTMLElement | undefined
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export const useResizeContainer = (props: UseResizeContainerProps) => {
  let timeout: NodeJS.Timeout

  const resize = (instant = false) => {
    if (timeout) clearTimeout(timeout)
    const wrapper = props.ref()
    if (!wrapper) return

    const startHeight = wrapper.offsetHeight
    wrapper!.style.height = 'auto'
    const endHeight = wrapper!.offsetHeight
    wrapper!.style.height = `${startHeight}px`

    let duration = Math.round(Math.log2(Math.abs(startHeight - endHeight)) * 25)
    if (!Number.isSafeInteger(duration) || instant) {
      duration = 0
    }
    wrapper!.style.transitionDuration = `${duration}ms`

    requestAnimationFrame(() => {
      if (duration) {
        props.onResizeStart?.()
      }
      if (wrapper?.style?.height) {
        wrapper.style.height = `${endHeight}px`
      }
      if (duration) {
        timeout = setTimeout(() => {
          props.onResizeEnd?.()
          wrapper.style.height = 'auto'
        }, duration)
      }
    })
  }

  return resize
}
