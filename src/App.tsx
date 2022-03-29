import { Navigate, Route, Router, Routes } from 'solid-app-router'
import { Component } from 'solid-js'
import Footer from './components/Footer'
import { Settings } from './components/Settings'
import SyncIndicator from './components/SyncIndicator'
import Home from './pages/Home'
import Scores from './pages/Scores'

const App: Component = () => {
  return (
    <Router>
      <SyncIndicator />
      <h1 class="text-5xl text-center mt-8 mb-16">Wordle Score</h1>
      <div class="max-w-sm mx-auto space-y-24 px-8 flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/*all" element={<Navigate href="/" />} />
        </Routes>
        <div class="space-y-12">
          <Settings />
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
