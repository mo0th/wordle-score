import { Accessor } from 'solid-js'

export type SingleDayScore = 1 | 2 | 3 | 4 | 5 | 6 | 'X'
export type ScoreRecordTuple = [number, SingleDayScore]
export type ScoreRecord = Record<string, SingleDayScore>
export type PersonScore = {
  score: number
  daysPlayed: number
  uncountedFails: number
  record?: ScoreRecord
}
export type AllScores = Record<string, PersonScore>

export type AccessorRecord<T> = {
  [K in keyof T]: Accessor<T[K]>
}
