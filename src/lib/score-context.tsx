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
  createRenderEffect,
  on,
} from 'solid-js'
import * as types from 'pheno'
import {
  AccessorRecord,
  AllScores,
  PersonScore,
  ScoreRecord,
  ScoreRecordTuple,
  SingleDayScore,
} from '~/types'
import { debounce, getHistoryDiffs } from '~/utils/misc'
import { useLocalStorage } from '~/utils/use-local-storage'
import { calculateCumulativeScores, scores } from './score-calc'
import { getCurrentDayOffset } from './wordle-stuff'
import { useSettings } from './settings'
import { plausible } from './plausible'

const DayScoreSchema = scores
  .filter(s => typeof s === 'number')
  .reduce(
    (accSchema, s) =>
      types.or(accSchema, types.exactNumber<Exclude<SingleDayScore, 'X'>>(s as any)),
    types.exactString('X') as types.TypeValidator<SingleDayScore>
  )
const ScoreRecordSchema = types.record(types.string, DayScoreSchema)

export type SyncStatus = 'idle' | 'loading' | 'success' | 'failed'
export type SyncDetails = {
  user: string
  password: string
}
export type ScoreContextValue = [
  AccessorRecord<{
    score: PersonScore
    record: ScoreRecord
    recordArray: ScoreRecordTuple[]
    syncDetails: SyncDetails
    canSync: boolean
    syncStatus: SyncStatus
    canRestore: boolean
  }> & {
    allScores: Resource<AllScores | undefined>
  },
  {
    setTodayScore(score: SingleDayScore): void
    setDayScore(day: number, score: SingleDayScore): void
    deleteDayScore(day: number): void
    setSyncDetails: Setter<SyncDetails>
    refetchAllScores: () => void
    getJsonBackup: () => string
    importJsonBackup: (json: unknown) => void
    isBackupValid: (obj: unknown) => obj is ScoreRecord
  }
]

type Getters = ScoreContextValue[0]
type Setters = ScoreContextValue[1]

const ScoreContext = createContext<ScoreContextValue | null>(null)

let lastFetchedAt: number | null = null

const useScoreRecordArray = (record: Getters['record']) => {
  const getEntries = (r: ScoreRecord) =>
    Object.entries(r)
      .map(([k, v]) => [parseInt(k), v] as ScoreRecordTuple)
      .filter(t => !Number.isNaN(t[0]))

  const sortEntries = (arr: ScoreRecordTuple[]) => arr.sort(([a], [b]) => a - b)

  let prevRecord = record()
  const [array, setArray] = createSignal<ScoreRecordTuple[]>(sortEntries(getEntries(record())))

  createRenderEffect(
    on(record, newRecord => {
      const newEntries = getEntries(newRecord)
      const prevEntries = array()
      const result: ScoreRecordTuple[] = []

      // copy over elements from previous render
      for (const entry of prevEntries) {
        const [day, score] = entry

        if (!newRecord[day]) {
          // if not in updated data, don't add it
          continue
        } else if (score !== newRecord[day]) {
          // if existing doesn't match updated, replace entry with new tuple
          result.push([day, newRecord[day]])
        } else {
          // if match, then re-use exisitng
          result.push(entry)
        }
      }

      for (const entry of newEntries) {
        const [day] = entry
        // if new day in updated data, add entry
        if (!prevRecord[day]) {
          result.push(entry)
        }
      }

      const entries = sortEntries(result)
      setArray(entries)
      prevRecord = newRecord
    })
  )

  return array
}

export type ScoreProviderProps = {
  focusRevalidate?: boolean
}
export const ScoreProvider: Component<ScoreProviderProps> = _props => {
  const props = mergeProps({ focusRevalidate: true }, _props)
  const [settings] = useSettings()
  const isNotSandbox = createMemo(() => !settings.sandboxMode)
  const [syncDetails, setSyncDetails] = useLocalStorage(
    'mooth:wordle-sync-details',
    {
      user: '',
      password: '',
    },
    undefined,
    isNotSandbox
  )

  const canSync = createMemo(() => {
    const d = syncDetails()
    return Boolean(d.user) && Boolean(d.password)
  })
  const [allScores, { refetch }] = createResource<AllScores, readonly [SyncDetails, boolean]>(
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
  const forceRefetch = () => {
    lastFetchedAt = 0
    refetch()
  }
  const [record, setRecord] = useLocalStorage<ScoreRecord>(
    'mooth:wordle-score',
    {},
    undefined,
    isNotSandbox
  )

  const recordArray = useScoreRecordArray(record)
  const score = createMemo(() => {
    return calculateCumulativeScores(record())
  })

  const setDayScore: Setters['setDayScore'] = (day, score) => {
    setRecord(record => ({ ...record, [day]: score }))
  }

  const setTodayScore: Setters['setTodayScore'] = score => {
    setDayScore(getCurrentDayOffset(), score)
  }

  const deleteDayScore: Setters['deleteDayScore'] = day => {
    setRecord(record => {
      delete record[day]
      return { ...record }
    })
  }

  const canRestore = createMemo(() => {
    if (settings.devStuff) return true
    const allServerData = allScores()
    if (!allServerData) return false
    const serverDataForUser = allServerData[syncDetails().user]
    if (!serverDataForUser?.record) return false
    if (serverDataForUser.daysPlayed === 0 || Object.keys(serverDataForUser.record).length === 0)
      return false
    if (dequal(serverDataForUser, { ...score(), record: record() })) return false
    return true
  })

  const [syncStatus, setSyncStatus] = createSignal<SyncStatus>('idle')

  const sync = debounce(
    async (
      canSync: boolean,
      syncDetails: SyncDetails,
      score: PersonScore,
      currentScores: AllScores | undefined,
      record: ScoreRecord
    ) => {
      if (settings.sandboxMode) return
      if (!navigator.onLine) return
      if (!canSync) return
      if (!currentScores) return
      const dataToSync = { ...score, record }
      const current = currentScores[syncDetails.user]
      delete current.mostRecentlyPlayed
      if (dequal(current, dataToSync)) return

      const diffs = current?.record ? getHistoryDiffs(current.record, record) : 0
      if (diffs > 1) {
        if (
          !confirm(
            `There are ${diffs} differences between your local data and your saved data. Are you sure you want to push changes? This WILL override any data on the server and may not be recoverable. Consider making a backup (in settings) first.`
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
          forceRefetch()
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

  createEffect(() => sync(canSync(), syncDetails(), score(), allScores(), record()))

  createEffect(() => {
    if (props.focusRevalidate) {
      const handler = () => {
        refetch()
      }

      window.addEventListener('focus', handler)

      onCleanup(() => window.removeEventListener('focus', handler))
    }
  })

  createEffect(() => {
    const user = syncDetails().user
    if (user) {
      plausible('user', { user })
    }
  })

  const getJsonBackup = () => JSON.stringify(record(), null, 2)
  const importJsonBackup = (json: unknown) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json
      if (!isBackupValid(parsed)) {
        return
      }
      setRecord(parsed)
    } catch {
      return
    }
  }
  const isBackupValid = (obj: unknown): obj is ScoreRecord => {
    return types.isOfType(obj, ScoreRecordSchema)
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
      canRestore,
    },
    {
      setDayScore,
      setTodayScore,
      deleteDayScore,
      setSyncDetails,
      refetchAllScores: refetch,
      getJsonBackup,
      importJsonBackup,
      isBackupValid,
    },
  ]

  return <ScoreContext.Provider value={store}>{props.children}</ScoreContext.Provider>
}

export const useScoreContext = () => {
  const ctx = useContext(ScoreContext)
  if (!ctx) {
    throw new Error('useSyncContext must be used inside <SyncProvider>')
  }
  return ctx
}
