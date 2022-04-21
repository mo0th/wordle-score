import { SingleDayScore } from '~/types'

export const scoreGoodnessTextColors = {
  good: 'text-green-700 dark:text-green-300',
  ok: 'text-yellow-700 dark:text-yellow-300',
  bad: 'text-red-700 dark:text-red-300',
} as const

export const getColorForDayScore = (s: SingleDayScore): string => {
  if (s <= 3) return scoreGoodnessTextColors.good
  if (s > 3 && s <= 5) return scoreGoodnessTextColors.ok
  return scoreGoodnessTextColors.bad
}

export const SCORE_GREAT_GLOW = 'score-great-glow'
