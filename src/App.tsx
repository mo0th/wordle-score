import { Link, Navigate, Route, Router, Routes } from 'solid-app-router'
import {
  Component,
  createEffect,
  createSignal,
  ErrorBoundary,
  lazy,
  onCleanup,
  Show,
  Suspense,
} from 'solid-js'
import Container from './components/Container'
import Footer from './components/Footer'
import { StuffAndSettings } from './components/settings/StuffAndSettings'
import Home from './pages/Home'
import Scores from './pages/Scores'
import SyncIndicator from './components/sync/SyncIndicator'
import { useSettings } from './lib/settings'
import { isDynamicImportError } from './utils/misc'

const Confetti = lazy(() => import('./components/confetti/Confetti'))
const Stats = lazy(() => import('./pages/Stats'))
const DevOverlay = lazy(() => import('./components/DevOverlay'))

const Heading: Component = () => {
  const [spinning, setSpinning] = createSignal(false)
  const [hovered, setHovered] = createSignal(false)

  createEffect(() => {
    if (hovered()) {
      const timeout = setTimeout(() => {
        setSpinning(true)
      }, 5000)

      onCleanup(() => clearTimeout(timeout))
    } else {
      setSpinning(false)
    }
  })

  return (
    <h1
      class="main-heading mt-8 mb-16 px-2 text-center text-6xl motion-safe:animate-spin sm:mt-12 sm:text-7xl md:text-8xl"
      style={{
        'overflow-wrap': 'break-word',
        'animation-play-state': spinning() ? 'running' : 'paused',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href="/">Wordle Score</Link>
    </h1>
  )
}

const App: Component = () => {
  const [settings, setSettings] = useSettings()
  return (
    <Router>
      <SyncIndicator />
      <Confetti />
      <div class="flex h-full flex-col">
        <Show when={settings.sandboxMode}>
          <div class="sticky top-0 z-50 bg-yellow-300 p-2 font-bold text-black">
            <Container>Sandbox mode enabled - changes won't be saved</Container>
          </div>
        </Show>
        <Heading />
        <Container class="relative flex-1 space-y-24 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scores" element={<Scores />} />
            <Route
              path="/stats"
              element={
                <Suspense
                  fallback={
                    <div class="text-center" style="min-height: 30vh">
                      loading...
                    </div>
                  }
                >
                  <Stats />
                </Suspense>
              }
            />
            <Route path="/*all" element={<Navigate href="/" />} />
          </Routes>
        </Container>
        <Container class="space-y-12">
          <StuffAndSettings />
          <Footer />
        </Container>
      </div>
      <Show when={settings.devStuff}>
        <ErrorBoundary
          fallback={err => {
            if (isDynamicImportError(err)) {
              setSettings('devStuff', false)
              return 'hello'
            }
            throw err
          }}
        >
          <Suspense>
            <DevOverlay />
          </Suspense>
        </ErrorBoundary>
      </Show>
    </Router>
  )
}

export default App
