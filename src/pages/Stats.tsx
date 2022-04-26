import { Component, createMemo, createSignal } from 'solid-js'
import NotHomePageLayout from '~/layouts/NotHomePageLayout'
import DistributionStats from '~/components/stats/DistributionStats'
import SummaryStats from '~/components/stats/SummaryStats'

import '~/styles/stats.css'
import { useScoreContext } from '~/lib/score-context'
import StatsSectionWrapper from '~/components/stats/StatsSectionWrapper'
import Button from '~/components/Button'

const Stats: Component = () => {
  const [{ recordArray }] = useScoreContext()
  const [nRecords, setNRecords] = createSignal<number | null>(null)

  const records = createMemo(() => {
    const array = recordArray()
    const nToShow = nRecords()
    if (nToShow === null) {
      return array
    }
    return array.slice(-nToShow)
  })

  return (
    <NotHomePageLayout title="Stats">
      <StatsSectionWrapper title="Timeframe">
        <div class="grid grid-cols-3 gap-2">
          <Button block onClick={() => setNRecords(7)}>
            Last 7 Days
          </Button>
          <Button block onClick={() => setNRecords(28)}>
            Last Month
          </Button>
          <Button block onClick={() => setNRecords(null)}>
            All Time
          </Button>
        </div>
      </StatsSectionWrapper>
      <DistributionStats records={records()} />
      <SummaryStats records={records()} />
    </NotHomePageLayout>
  )
}

export default Stats
