/* @refresh reload */
import { render } from 'solid-js/web'
import DefaultErrorBoundary from '~/components/DefaultErrorBoundary'
import { ScoreProvider } from '~/lib/score-context'
import { SettingsProvider } from '~/lib/settings'

import '~/styles/index.css'
import App from '~/App'

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
