import { Component } from 'solid-js'
import { scores } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'
import Button from './Button'

const ReadScoreFromClipboard: Component = () => {
  const [, { setTodayScore }] = useScoreContext()
  return (
    <Button
      block
      onClick={async () => {
        const text = (await navigator.clipboard.readText()).trim()
        const firstLine = text.split('\n')[0]

        const today = getCurrentDayOffset()

        const matches = firstLine.match(
          new RegExp(`Wordle ${today} (?<score>[123456X])/6`)
        )

        const matchedScore = matches?.groups?.score
        const scoreToMaybeInsert: any =
          matchedScore === 'X' ? matchedScore : parseInt(matchedScore as any)

        if (scores.includes(scoreToMaybeInsert as any)) {
          setTodayScore(scoreToMaybeInsert as any)
        } else {
          alert('Make sure you copied the right text')
        }
      }}
    >
      Get today's score from clipboard
    </Button>
  )
}

export default ReadScoreFromClipboard
