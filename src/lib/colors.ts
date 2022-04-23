import { cx, lessThanOrEqualWithError } from '~/utils/misc'
import { settings } from './settings'

export const scoreGoodnessTextColors = {
  good: 'text-green-700 dark:text-green-300',
  ok: 'text-yellow-700 dark:text-yellow-300',
  bad: 'text-red-700 dark:text-red-300',
} as const

const E = 0.001

const getColorForDayScore = (s: string | number): string => {
  if (s === 'X') return scoreGoodnessTextColors.bad
  if (typeof s === 'string') return ''
  if (Math.round(s) <= 3) return scoreGoodnessTextColors.good
  if (Math.round(s) < 5) return scoreGoodnessTextColors.ok
  return scoreGoodnessTextColors.bad
}

export const SCORE_GREAT_GLOW = 'score-great-glow'

export const getClassesForScore = (s: string | number): string => {
  return cx(
    settings.colorScores && getColorForDayScore(s),
    s === 1 && settings.glowyNumbers && SCORE_GREAT_GLOW
  )
}
