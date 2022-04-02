import { Component } from 'solid-js'
import { ScoreRenderData } from '../lib/score-calc'
import { plural } from '../utils/misc'

interface SecondaryScoreDetailsProps {
  record: ScoreRenderData
}

const SecondaryScoreDetails: Component<SecondaryScoreDetailsProps> = props => {
  return (
    <p class="text-sm">
      {[
        `${props.record.daysPlayed} ${plural(
          props.record.daysPlayed,
          'day',
          'days'
        )}`,
        `${props.record.scorePerDay} avg`,
        `${props.record.uncountedFails} uncounted X's`,
      ].join(' • ')}
    </p>
  )
}

export default SecondaryScoreDetails
