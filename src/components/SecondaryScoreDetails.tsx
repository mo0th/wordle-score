import { Component } from 'solid-js'
import { scoreGoodnessTextColors } from '~/lib/colors'
import { ScoreRenderData } from '~/lib/score-calc'
import { useSettings } from '~/lib/settings'
import { cx, formatScoreNumber, lessThanOrEqualWithError, plural } from '~/utils/misc'
import CountUp from './CountUp'

interface SecondaryScoreDetailsProps {
  record: ScoreRenderData
}

const E = 0.001

const getAverageScoreRating = (avg: number): keyof typeof scoreGoodnessTextColors => {
  if (lessThanOrEqualWithError(avg, 2, E)) return 'good'
  if (lessThanOrEqualWithError(avg, 4, E)) return 'ok'
  return 'bad'
}

const SecondaryScoreDetails: Component<SecondaryScoreDetailsProps> = props => {
  const [settings] = useSettings()
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
                settings.colorScores && scoreGoodnessTextColors[getAverageScoreRating(count())]
              )}
            >
              {formatScoreNumber(count(), {
                shortenBigNumbers: settings.shortenBigNumbers,
                truncateMax: 0,
              })}
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
