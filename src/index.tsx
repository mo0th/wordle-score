/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'

import './index.css'
import { DevProvider } from './lib/dev-context'
import { ScoreProvider } from './lib/score-context'

render(
  () => (
    <DevProvider>
      <ScoreProvider>
        <App />
      </ScoreProvider>
    </DevProvider>
  ),
  document.getElementById('root') as HTMLElement
)
