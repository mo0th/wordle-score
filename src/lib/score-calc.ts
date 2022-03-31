import { createMemo } from 'solid-js'
import {
  AccessorRecord,
  PersonScore,
  ScoreRecord,
  ScoreRecordTuple,
  SingleDayScore,
} from '../types'
import { minmax } from '../utils/misc'
import { useLocalStorage } from '../utils/use-local-storage'
import { getCurrentDayOffset } from './wordle-stuff'

export type ScoreAccessors = AccessorRecord<{
  score: PersonScore
  record: ScoreRecord
  recordArray: ScoreRecordTuple[]
}>
export type ScoreSetters = {
  setTodayScore(score: SingleDayScore): void
  setDayScore(day: number, score: SingleDayScore): void
  deleteDayScore(day: number): void
}
export const scores: SingleDayScore[] = [1, 2, 3, 4, 5, 6, 'X']

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

export const calculateCumulativeScores = (record: ScoreRecord): PersonScore => {
  const daysPlayed = Object.keys(record)
    .map(str => parseInt(str))
    .filter(n => !Number.isNaN(n))

  if (daysPlayed.length < 1) {
    return { score: 0, daysPlayed: 0, uncountedFails: 0 }
  }

  const [minDay, maxDay] = minmax(daysPlayed)
  let score = 0
  let uncountedFails = 0

  for (let i = minDay; i < maxDay + 1; ++i) {
    if (i in record) {
      const dayScore = record[i]

      if (dayScore === 'X') {
        uncountedFails++
      } else {
        score += Math.pow(3, uncountedFails) * dayScore
        uncountedFails = 0
      }
    } else {
      score *= 3
    }
  }

  return { score, daysPlayed: daysPlayed.length, uncountedFails }
}
