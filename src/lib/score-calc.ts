import { createMemo } from 'solid-js'
import {
  AccessorRecord,
  ScoreRecord,
  ScoreRecordTuple,
  SingleDayScore,
} from '../types'
import { minmax } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'
import { getCurrentDayOffset } from './wordle-stuff'

type ScoreAccessors = AccessorRecord<{
  score: CumulativeScores
  record: ScoreRecord
  recordArray: ScoreRecordTuple[]
}>
type ScoreSetters = {
  setTodayScore(score: SingleDayScore): void
  setDayScore(day: number, score: SingleDayScore): void
  deleteDayScore(day: number): void
}

export const useScore = (): [ScoreAccessors, ScoreSetters] => {
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
    console.log('hello')
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

  return [
    { score, record, recordArray },
    { setTodayScore, setDayScore, deleteDayScore },
  ]
}

export type CumulativeScores = {
  score: number
  daysPlayed: number
}

export const calculateCumulativeScores = (
  record: ScoreRecord
): CumulativeScores => {
  const daysPlayed = Object.keys(record)
    .map(str => parseInt(str))
    .filter(n => !Number.isNaN(n))

  if (daysPlayed.length < 1) {
    return { score: 0, daysPlayed: 0 }
  }

  const [minDay, maxDay] = minmax(daysPlayed)
  let score = 0

  console.log({ minDay, maxDay })
  for (let i = minDay; i < maxDay + 1; ++i) {
    if (i in record) {
      const dayScore = record[i]

      if (dayScore === 'X') {
        score *= 3
      } else {
        console.log(i, record[i])
        score += dayScore
      }
    } else {
      score *= 3
    }
  }

  return { score, daysPlayed: daysPlayed.length }
}
