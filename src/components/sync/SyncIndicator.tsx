import { Component } from 'solid-js'
import ScorePushIndicator from './ScorePushIndicator'
import ScoresPullIndicator from './ScoresPullIndicator'

const SyncIndicator: Component = () => {
  return (
    <>
      <ScorePushIndicator />
      <ScoresPullIndicator />
    </>
  )
}

export default SyncIndicator
