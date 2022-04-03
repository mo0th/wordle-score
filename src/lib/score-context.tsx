import { dequal } from 'dequal'
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
  onCleanup,
  mergeProps,
} from 'solid-js'
import { AccessorRecord, AllScores, PersonScore } from '../types'
import { debounce } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'
import { ScoreAccessors, ScoreSetters, useScore } from './score-calc'

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
      allScores: Resource<AllScores | undefined>
    },
  ScoreSetters & {
    setSyncDetails: Setter<SyncDetails>
    refetchAllScores: () => void
  }
]

const ScoreContext = createContext<ScoreContextValue | null>(null)

let lastFetchedAt: number | null = null

export type ScoreProviderProps = {
  focusRevalidate: boolean
}
export const ScoreProvider: Component<ScoreProviderProps> = _props => {
  const props = mergeProps({ focusRevalidate: true }, _props)
  const [syncDetails, setSyncDetails] = useLocalStorage(
    'mooth:wordle-sync-details',
    { user: '', password: '' }
  )
  const canSync = createMemo(() => {
    const d = syncDetails()
    return Boolean(d.user) && Boolean(d.password)
  })
  const password = createMemo(() => syncDetails().password)
  const [allScores, { refetch }] = createResource<
    AllScores,
    readonly [string, boolean]
  >(
    () => [password(), canSync()] as const,
    async ([password, canSync], { value, refetching }) => {
      if (lastFetchedAt && Date.now() - lastFetchedAt < 10_000 && value) {
        return value
      }

      try {
        if (!canSync) return {}
        const response = await fetch('/api/get-scores', {
          headers: {
            authorization: `Bearer ${password}`,
          },
        })
        if (!response.ok) throw new Error('Request not 2XX')
        const json = await response.json()
        lastFetchedAt = Date.now()
        if (refetching && dequal(value, json)) {
          return value as AllScores
        }
        return json
      } catch (err) {
        lastFetchedAt = null
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
      score: PersonScore,
      currentScores: AllScores | undefined
    ) => {
      if (!canSync) return
      if (!currentScores) return
      if (dequal(currentScores[syncDetails.user], score)) return

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

  createEffect(() => sync(canSync(), syncDetails(), score(), allScores()))

  createEffect(() => {
    if (props.focusRevalidate) {
      const handler = () => {
        refetch()
      }

      window.addEventListener('focus', handler)

      onCleanup(() => window.removeEventListener('focus', handler))
    }
  })

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
    {
      setDayScore,
      setTodayScore,
      deleteDayScore,
      setSyncDetails,
      refetchAllScores: refetch,
    },
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
