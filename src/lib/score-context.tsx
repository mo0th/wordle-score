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
import {
  AccessorRecord,
  AllScores,
  PersonScore,
  ScoreRecord,
  ScoreRecordTuple,
} from '~/types'
import { debounce, getHistoryDiffs } from '~/utils/misc'
import { useLocalStorage } from '~/utils/use-local-storage'
import {
  calculateCumulativeScores,
  ScoreAccessors,
  ScoreSetters,
} from './score-calc'
import { getCurrentDayOffset } from './wordle-stuff'

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
      canRestore: boolean
    }> & {
      allScores: Resource<AllScores | undefined>
    },
  ScoreSetters & {
    setSyncDetails: Setter<SyncDetails>
    refetchAllScores: () => void
    restoreFromSaved: () => void
  }
]

const ScoreContext = createContext<ScoreContextValue | null>(null)

let lastFetchedAt: number | null = null

export type ScoreProviderProps = {
  focusRevalidate?: boolean
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
  const [allScores, { refetch }] = createResource<
    AllScores,
    readonly [SyncDetails, boolean]
  >(
    () => [syncDetails(), canSync()] as const,
    async ([{ password, user }, canSync], { value, refetching }) => {
      if (lastFetchedAt && Date.now() - lastFetchedAt < 10_000 && value) {
        return value
      }

      if (!navigator.onLine) return value

      try {
        if (!canSync) return {}
        const response = await fetch('/api/get-scores', {
          headers: {
            authorization: `Bearer ${password}`,
            'x-user': user,
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
  const [record, setRecord] = useLocalStorage<ScoreRecord>(
    'mooth:wordle-score',
    {}
  )

  const recordArray = createMemo(() =>
    Object.entries(record())
      .map(([k, v]) => [parseInt(k), v] as ScoreRecordTuple)
      .filter(t => !Number.isNaN(t[0]))
      .sort(([a], [b]) => a - b)
  )
  const score = createMemo(() => {
    return calculateCumulativeScores(record())
  })

  const setDayScore: ScoreSetters['setDayScore'] = (day, score) => {
    setRecord(record => ({ ...record, [day]: score }))
  }

  const setTodayScore: ScoreSetters['setTodayScore'] = score => {
    setDayScore(getCurrentDayOffset(), score)
  }

  const deleteDayScore: ScoreSetters['deleteDayScore'] = day => {
    setRecord(record => {
      delete record[day]
      return { ...record }
    })
  }

  const canRestore = createMemo(() => {
    const allServerData = allScores()
    if (!allServerData) return false
    const serverDataForUser = allServerData[syncDetails().user]
    if (!serverDataForUser?.record) return false
    if (
      serverDataForUser.daysPlayed === 0 ||
      Object.keys(serverDataForUser.record).length === 0
    )
      return false
    return true
  })
  const restoreFromSaved = () => {
    if (!canRestore) return
    const allServerData = allScores()
    if (!allServerData) return
    const serverDataForUser = allServerData[syncDetails().user]
    if (
      serverDataForUser.record &&
      confirm(
        "Are you sure you want to restore from your saved data? This can't be undone."
      )
    ) {
      setRecord(serverDataForUser.record)
    }
  }

  const [syncStatus, setSyncStatus] = createSignal<SyncStatus>('idle')

  const sync = debounce(
    async (
      canSync: boolean,
      syncDetails: SyncDetails,
      score: PersonScore,
      currentScores: AllScores | undefined,
      record: ScoreRecord
    ) => {
      if (!canSync) return
      if (!currentScores) return
      const dataToSync = { ...score, record }
      const current = currentScores[syncDetails.user]
      console.log({ canSync, currentScores, d: dequal(current, dataToSync) })
      if (dequal(current, dataToSync)) return
      if (!navigator.onLine) return

      const diffs = getHistoryDiffs(current.record || {}, record)
      if (diffs > 1) {
        if (
          !confirm(
            `There are ${diffs} differences between your local data and your saved data. Are you sure you want to push changes?`
          )
        ) {
          return
        }
      }

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
            data: dataToSync,
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

  createEffect(() =>
    sync(canSync(), syncDetails(), score(), allScores(), record())
  )

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
      canRestore,
    },
    {
      setDayScore,
      setTodayScore,
      deleteDayScore,
      setSyncDetails,
      refetchAllScores: refetch,
      restoreFromSaved,
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
