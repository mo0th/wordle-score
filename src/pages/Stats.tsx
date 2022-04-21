import { Component } from 'solid-js'
import NotHomePageLayout from '~/layouts/NotHomePageLayout'
import DistributionStats from '~/components/stats/DistributionStats'
import SummaryStats from '~/components/stats/SummaryStats'

const Stats: Component = () => {
  return (
    <NotHomePageLayout title="Stats">
      <DistributionStats />
      <SummaryStats />
    </NotHomePageLayout>
  )
}

export default Stats
