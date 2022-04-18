import { Component, ErrorBoundary } from 'solid-js'
import Container from './Container'

interface DefaultErrorBoundaryProps {}

const DefaultErrorBoundary: Component<DefaultErrorBoundaryProps> = props => {
  return (
    <ErrorBoundary
      fallback={error => (
        <>
          <h1
            class="mt-8 mb-16 px-2 text-center text-6xl sm:mt-12 sm:text-7xl md:text-8xl"
            style="overflow-wrap: break-word"
          >
            Something broke!
          </h1>
          <Container class="space-y-12">
            <pre class="whitespace-pre-wrap">
              {error instanceof Error ? error.stack : error.toString()}
            </pre>
          </Container>
        </>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}

export default DefaultErrorBoundary
