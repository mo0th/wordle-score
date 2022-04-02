import { Component } from 'solid-js'
import { ScoreRenderData } from '../lib/score-calc'
import { cx, plural, toFixedOrLess } from '../utils/misc'
import CountUp from './CountUp'

interface SecondaryScoreDetailsProps {
  record: ScoreRenderData
}

const avgScoreColors = {
  good: 'text-green-700 dark:text-green-300',
  ok: 'text-yellow-700 dark:text-yellow-300',
  bad: 'text-red-700 dark:text-red-300',
} as const

const getAverageScoreRating = (avg: number): keyof typeof avgScoreColors => {
  if (0 <= avg && avg <= 2) return 'good'
  if (avg <= 4) return 'ok'
  return 'bad'
}

const SecondaryScoreDetails: Component<SecondaryScoreDetailsProps> = props => {
  return (
    <p class="text-sm">
      <span>
        <span class="font-mono">
          <CountUp to={props.record.daysPlayed} />
        </span>{' '}
        {plural(props.record.daysPlayed, 'day', 'days')}
      </span>
      <span> • </span>
      <span>
        <CountUp to={props.record.scorePerDay}>
          {count => (
            <span
              class={cx(
                'font-mono',
                avgScoreColors[getAverageScoreRating(count())]
              )}
            >
              {toFixedOrLess(count(), 2)}
            </span>
          )}
        </CountUp>{' '}
        avg
      </span>
      <span> • </span>
      <span>
        <span class="font-mono">
          <CountUp to={props.record.uncountedFails} />
        </span>{' '}
        uncounted {plural(props.record.uncountedFails, 'X', "X's")}
      </span>
    </p>
  )
}

export default SecondaryScoreDetails
