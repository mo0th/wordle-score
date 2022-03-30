import { Link, Navigate, Route, Router, Routes } from 'solid-app-router'
import { Component } from 'solid-js'
import Footer from './components/Footer'
import { StuffAndSettings } from './components/StuffAndSettings'
import SyncIndicator from './components/SyncIndicator'
import Home from './pages/Home'
import Scores from './pages/Scores'

const App: Component = () => {
  return (
    <Router>
      <SyncIndicator />
      <h1
        class="text-6xl sm:text-7xl md:text-8xl sm:mt-12 text-center mt-8 mb-16 px-2"
        style="overflow-wrap: breakw-word"
      >
        <Link href="/">Wordle Score</Link>
      </h1>
      <div class="max-w-md mx-auto space-y-24 px-8 flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/*all" element={<Navigate href="/" />} />
        </Routes>
        <div class="space-y-12">
          <StuffAndSettings />
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
