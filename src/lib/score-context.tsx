import {
  Component,
  createContext,
  useContext,
  createResource,
  createMemo,
  createEffect,
  createSignal,
  Resource,
} from 'solid-js'
import { AccessorRecord, AllScores } from '../types'
import { debounce } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'
import { ScoreAccessors, ScoreSetters, useScore } from './score-calc'

type SyncStatus = 'idle' | 'loading' | 'success' | 'failed'
type SyncDetails = {
  user: string
  password: string
}
type ScoreContextValue = [
  ScoreAccessors &
    AccessorRecord<{
      syncDetails: SyncDetails
      canSync: boolean
      syncStatus: SyncStatus
    }> & {
      allScores: Resource<AllScores>
    },
  ScoreSetters & {
    setSyncDetail<K extends keyof SyncDetails>(k: K, v: SyncDetails[K]): void
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
  const [allScores, { refetch }] = createResource(
    () => [syncDetails(), canSync()] as const,
    async ([details, canSync]) => {
      try {
        if (!canSync) return {}
        const response = await fetch('/api/get-scores', {
          headers: {
            authorization: `Bearer ${details.password}`,
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

  const sync = debounce(async () => {
    if (!canSync()) return

    setSyncStatus('loading')
    try {
      const response = await fetch('/api/set-score', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${syncDetails().password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: syncDetails().user,
          data: score(),
        }),
      })
      const json = await response.json()
      if (json.success) {
        refetch()
        setSyncStatus('success')
      } else {
        setSyncStatus('failed')
      }
    } catch (err) {
      setSyncStatus('failed')
    }
  }, 250)

  createEffect(() => sync())

  const setSyncDetail = <K extends keyof SyncDetails>(
    k: K,
    v: SyncDetails[K]
  ): void => {
    setSyncDetails(d => ({ ...d, [k]: v }))
  }

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
    { setDayScore, setTodayScore, deleteDayScore, setSyncDetail },
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
