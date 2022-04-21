import { SingleDayScore } from '~/types'
import { cx, lessThanOrEqualWithError } from '~/utils/misc'
import { settings } from './settings'

export const scoreGoodnessTextColors = {
  good: 'text-green-700 dark:text-green-300',
  ok: 'text-yellow-700 dark:text-yellow-300',
  bad: 'text-red-700 dark:text-red-300',
} as const

const E = 0.001

const getColorForDayScore = (s: SingleDayScore | number): string => {
  if (s === 'X') return scoreGoodnessTextColors.bad
  if (lessThanOrEqualWithError(s, 3, E)) return scoreGoodnessTextColors.good
  if (lessThanOrEqualWithError(s, 5, E)) return scoreGoodnessTextColors.ok
  return scoreGoodnessTextColors.bad
}

export const SCORE_GREAT_GLOW = 'score-great-glow'

export const getClassesForScore = (s: SingleDayScore | number): string => {
  return cx(
    settings.colorScores && getColorForDayScore(s),
    s === 1 && settings.glowyNumbers && SCORE_GREAT_GLOW
  )
}
