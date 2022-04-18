import { Link, Navigate, Route, Router, Routes } from 'solid-app-router'
import { Component, createEffect, createSignal, lazy, onCleanup } from 'solid-js'
import Container from './components/Container'
import Footer from './components/Footer'
import { StuffAndSettings } from './components/StuffAndSettings'
import Home from './pages/Home'
import Scores from './pages/Scores'
import SyncIndicator from './components/sync/SyncIndicator'

const Confetti = lazy(() => import('./components/confetti/Confetti'))

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
      class="main-heading mt-8 mb-16 animate-spin px-2 text-center text-6xl sm:mt-12 sm:text-7xl md:text-8xl"
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
  return (
    <Router>
      <SyncIndicator />
      <Confetti />
      <Heading />
      <Container class="space-y-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/*all" element={<Navigate href="/" />} />
        </Routes>
        <div class="space-y-12">
          <StuffAndSettings />
          <Footer />
        </div>
      </Container>
    </Router>
  )
}

export default App
