/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'

import './index.css'
import { ScoreProvider } from './lib/score-context'

render(
  () => (
    <ScoreProvider>
      <App />
    </ScoreProvider>
  ),
  document.getElementById('root') as HTMLElement
)
