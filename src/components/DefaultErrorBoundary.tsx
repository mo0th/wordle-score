import { Component, ErrorBoundary } from 'solid-js'
import Container from './Container'

interface DefaultErrorBoundaryProps {}

const DefaultErrorBoundary: Component<DefaultErrorBoundaryProps> = props => {
  return (
    <ErrorBoundary
      fallback={error => (
        <>
          <h1
            class="text-6xl sm:text-7xl md:text-8xl sm:mt-12 text-center mt-8 mb-16 px-2"
            style="overflow-wrap: break-word"
          >
            Something broke!
          </h1>
          <Container class="space-y-12">
            <pre>{error.toString()}</pre>
          </Container>
        </>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}

export default DefaultErrorBoundary
