import { Link, Navigate, Route, Router, Routes } from 'solid-app-router'
import { Component, Show } from 'solid-js'
import Confetti from './components/confetti/Confetti'
import Container from './components/Container'
import Footer from './components/Footer'
import { RefreshIcon } from './components/icons'
import { StuffAndSettings } from './components/StuffAndSettings'
import SyncIndicator from './components/SyncIndicator'
import { useScoreContext } from './lib/score-context'
import Home from './pages/Home'
import Scores from './pages/Scores'

const App: Component = () => {
  const [{ allScores }] = useScoreContext()
  return (
    <Router>
      <SyncIndicator />
      <Confetti />
      <div
        class="fixed left-4 top-4 transition-transform"
        style={{
          transform: `translateY(${allScores.loading ? 0 : '-3rem'})`,
        }}
      >
        <RefreshIcon class="animate-spin w-6 h-6 opacity-75" />
      </div>
      <h1
        class="text-6xl sm:text-7xl md:text-8xl sm:mt-12 text-center mt-8 mb-16 px-2"
        style="overflow-wrap: break-word"
      >
        <Link href="/">Wordle Score</Link>
      </h1>
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
