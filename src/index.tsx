/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import DefaultErrorBoundary from './components/DefaultErrorBoundary'

import './index.css'
import { DevProvider } from './lib/dev-context'
import { ScoreProvider } from './lib/score-context'

render(
  () => (
    <DefaultErrorBoundary>
      <DevProvider>
        <ScoreProvider>
          <App />
        </ScoreProvider>
      </DevProvider>
    </DefaultErrorBoundary>
  ),
  document.getElementById('root') as HTMLElement
)
