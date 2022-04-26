import { Component, createMemo, createSignal, For, Show } from 'solid-js'
import NotHomePageLayout from '~/layouts/NotHomePageLayout'
import DistributionStats from '~/components/stats/DistributionStats'
import SummaryStats from '~/components/stats/SummaryStats'

import '~/styles/stats.css'
import { useScoreContext } from '~/lib/score-context'
import StatsSectionWrapper from '~/components/stats/StatsSectionWrapper'
import Button from '~/components/Button'
import { getCurrentDayOffset } from '~/lib/wordle-stuff'

const Stats: Component = () => {
  const [{ recordArray }] = useScoreContext()
  const [nRecords, setNRecords] = createSignal<number | null>(null)

  const earliest = createMemo(() => {
    const nToShow = nRecords()
    if (nToShow === null) {
      return 0
    }
    const currentDay = getCurrentDayOffset()
    const earliest = currentDay - nToShow + 1
    return earliest
  })
  const records = createMemo(() => {
    const earliestDay = earliest()
    return recordArray().filter(([day]) => day >= earliestDay)
  })

  const timeframes: [string, number | null][] = [
    ['Last 7 Days', 7],
    ['Last Month', 28],
    ['All Time', null],
  ]

  return (
    <NotHomePageLayout title="Stats">
      <Show when={recordArray().length > 0} fallback={<p>You don't have any data yet</p>}>
        <StatsSectionWrapper title="Timeframe">
          <div class="grid grid-cols-3 gap-2">
            <For each={timeframes}>
              {([title, timeframe]) => (
                <Button
                  block
                  active={timeframe === nRecords()}
                  onClick={() => setNRecords(timeframe)}
                >
                  {title}
                </Button>
              )}
            </For>
          </div>
        </StatsSectionWrapper>
        <DistributionStats records={records()} />
        <SummaryStats records={records()} />
      </Show>
    </NotHomePageLayout>
  )
}

export default Stats
