import { Component, createEffect, createMemo, For, onCleanup } from 'solid-js'
import Chart from 'chart.js/auto'
import { getClassesForScore } from '~/lib/colors'
import { scores } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { SingleDayScore } from '~/types'
import { twColors } from '~/lib/tailwind'
import { cond, cx, sum } from '~/utils/misc'
import StatsSectionWrapper from './StatsSectionWrapper'

const DistributionStats: Component = () => {
  const [settings] = useSettings()
  const [{ recordArray }] = useScoreContext()

  const counts = createMemo(() => {
    const results = Object.fromEntries(scores.map(s => [s, 0] as const)) as Record<
      SingleDayScore,
      number
    >
    recordArray().forEach(([_, score]) => {
      results[score]++
    })
    return scores.map(s => [s, results[s]] as const)
  })

  const total = createMemo(() => sum(counts().map(([_, c]) => c)))

  let canvas: HTMLCanvasElement | undefined

  createEffect(() => {
    if (!canvas) return

    const isLight = settings.theme === 'light'

    const bgIndex = cond(isLight, '700', '300')
    const bgGreen = twColors.green[bgIndex]
    const bgYellow = twColors.yellow[bgIndex]
    const bgRed = twColors.red[bgIndex]
    const borderIndex = cond(isLight, '900', '100')
    const borderGreen = twColors.green[borderIndex]
    const borderYellow = twColors.yellow[borderIndex]
    const borderRed = twColors.red[borderIndex]

    const text = twColors.gray[cond(isLight, '600', '400')]
    const border = twColors.gray[cond(isLight, '300', '700')]

    const backgroundColors = [bgGreen, bgGreen, bgGreen, bgYellow, bgYellow, bgRed, bgRed]

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: scores,
        datasets: [
          {
            label: '',
            data: counts().map(([_, c]) => c),
            backgroundColor: backgroundColors,
            borderColor: [
              borderGreen,
              borderGreen,
              borderGreen,
              borderYellow,
              borderYellow,
              borderRed,
              borderRed,
            ],
            borderWidth: 3,
            hoverBackgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: text,
            },
            grid: {
              color: 'transparent',
              borderColor: text,
            },
          },
          y: {
            ticks: {
              color: text,
            },
            grid: {
              borderColor: text,
              color: border,
            },
          },
        },
      },
    })

    onCleanup(() => {
      chart.destroy()
    })
  })

  return (
    <StatsSectionWrapper title="Distribution">
      <table class={cx('stat-table w-full table-fixed overflow-x-auto font-mono')}>
        <thead>
          <tr>
            <For each={scores}>{s => <th class={getClassesForScore(s)}>{s}</th>}</For>
            <th>T</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <For each={counts()}>{([_, c]) => <td>{Math.floor(c)}</td>}</For>
            <td>{total()}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <canvas ref={canvas} />
      </div>
    </StatsSectionWrapper>
  )
}

export default DistributionStats
