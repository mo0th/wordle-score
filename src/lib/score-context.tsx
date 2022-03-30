import {
  Component,
  createContext,
  useContext,
  createResource,
  createMemo,
  createEffect,
  createSignal,
  Resource,
  Setter,
} from 'solid-js'
import { AccessorRecord, AllScores } from '../types'
import { debounce } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'
import {
  CumulativeScores,
  ScoreAccessors,
  ScoreSetters,
  useScore,
} from './score-calc'

export type SyncStatus = 'idle' | 'loading' | 'success' | 'failed'
export type SyncDetails = {
  user: string
  password: string
}
export type ScoreContextValue = [
  ScoreAccessors &
    AccessorRecord<{
      syncDetails: SyncDetails
      canSync: boolean
      syncStatus: SyncStatus
    }> & {
      allScores: Resource<AllScores>
    },
  ScoreSetters & {
    setSyncDetails: Setter<SyncDetails>
  }
]

const ScoreContext = createContext<ScoreContextValue | null>(null)

export const ScoreProvider: Component = props => {
  const [syncDetails, setSyncDetails] = useLocalStorage(
    'mooth:wordle-sync-details',
    { user: '', password: '' }
  )
  const canSync = createMemo(() => {
    const d = syncDetails()
    return Boolean(d.user) && Boolean(d.password)
  })
  const password = createMemo(() => syncDetails().password)
  const [allScores, { refetch }] = createResource(
    () => [password(), canSync()] as const,
    async ([password, canSync]) => {
      try {
        if (!canSync) return {}
        const response = await fetch('/api/get-scores', {
          headers: {
            authorization: `Bearer ${password}`,
          },
        })
        const json = await response.json()
        return json
      } catch (err) {
        return {}
      }
    }
  )
  const [
    { record, score, recordArray },
    { deleteDayScore, setDayScore, setTodayScore },
  ] = useScore()

  const [syncStatus, setSyncStatus] = createSignal<SyncStatus>('idle')

  const sync = debounce(
    async (
      canSync: boolean,
      syncDetails: SyncDetails,
      score: CumulativeScores
    ) => {
      if (!canSync) return

      setSyncStatus('loading')
      try {
        const response = await fetch('/api/set-score', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${syncDetails.password}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: syncDetails.user,
            data: score,
          }),
        })
        const json = await response.json()
        if (json.success === true) {
          refetch()
          setSyncStatus('success')
        } else {
          setSyncStatus('failed')
        }
      } catch (err) {
        setSyncStatus('failed')
      }
    },
    500
  )

  createEffect(() => sync(canSync(), syncDetails(), score()))

  const store: ScoreContextValue = [
    {
      record,
      score,
      recordArray,
      allScores,
      syncDetails,
      canSync,
      syncStatus,
    },
    { setDayScore, setTodayScore, deleteDayScore, setSyncDetails },
  ]

  return (
    <ScoreContext.Provider value={store}>
      {props.children}
    </ScoreContext.Provider>
  )
}

export const useScoreContext = () => {
  const ctx = useContext(ScoreContext)
  if (!ctx) {
    throw new Error('useSyncContext must be used inside <SyncProvider>')
  }
  return ctx
}
