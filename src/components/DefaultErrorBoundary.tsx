import { Component, ErrorBoundary } from 'solid-js'
import { useCopy } from '~/utils/use-copy'
import Button from './Button'
import Collapse from './Collapse'
import Container from './Container'
import Footer from './Footer'

interface DefaultErrorBoundaryProps {}

const DefaultErrorBoundary: Component<DefaultErrorBoundaryProps> = props => {
  return (
    <ErrorBoundary
      fallback={(error, reset) => {
        const [copy, copied] = useCopy()
        const errorMessage = error instanceof Error ? error.stack : error.toString()

        return (
          <div class="space-y-24">
            <h1
              class="mt-8 mb-16 px-2 text-center text-6xl sm:mt-12 sm:text-7xl md:text-8xl"
              style="overflow-wrap: break-word"
            >
              Something broke!
            </h1>

            <Container class="space-y-12">
              <div class="grid grid-cols-2 gap-2">
                <Button onClick={() => window.location.reload()}>Reload Page</Button>
                <Button onClick={() => reset()}>Try Again</Button>
              </div>

              <p>
                If this keeps happenning,{' '}
                <a
                  class="link"
                  href="https://mooth.tech/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  send me
                </a>{' '}
                the error below.
              </p>

              <Button block onClick={() => copy(errorMessage)}>
                {copied() ? 'Copied' : 'Copy Error Message'}
              </Button>

              <Collapse summary="Error Details">
                <pre class="whitespace-pre-wrap break-all">{errorMessage}</pre>
              </Collapse>

              <Footer />
            </Container>
          </div>
        )
      }}
    >
      {props.children}
    </ErrorBoundary>
  )
}

export default DefaultErrorBoundary
