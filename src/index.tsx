/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import DefaultErrorBoundary from './components/DefaultErrorBoundary'

import { ScoreProvider } from './lib/score-context'
import { SettingsProvider } from './lib/settings'

import './index.css'

// ;(() => {
//   throw new Error('test')
// })()

render(
  () => (
    <DefaultErrorBoundary>
      <SettingsProvider>
        <ScoreProvider>
          <App />
        </ScoreProvider>
      </SettingsProvider>
    </DefaultErrorBoundary>
  ),
  document.getElementById('root') as HTMLElement
)
