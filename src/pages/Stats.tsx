import { Component, createEffect, createMemo, For, onCleanup } from 'solid-js'
import Chart from 'chart.js/auto'

import NotHomePageLayout from '~/layouts/NotHomePageLayout'
import { getColorForDayScore } from '~/lib/colors'
import { scores } from '~/lib/score-calc'
import { useScoreContext } from '~/lib/score-context'
import { useSettings } from '~/lib/settings'
import { SingleDayScore } from '~/types'
import { twColors } from '~/lib/tailwind'
import { cond, cx } from '~/utils/misc'

const Stats: Component = () => {
  return (
    <NotHomePageLayout title="Stats">
      <Distribution />
    </NotHomePageLayout>
  )
}

export default Stats

const Distribution: Component = () => {
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

  let canvas: HTMLCanvasElement | undefined

  createEffect(() => {
    if (!canvas) return

    const isLight = settings.theme === 'light'

    const bgIndex = cond(isLight, '200', '800')
    const bgGreen = twColors.green[bgIndex]
    const bgYellow = twColors.yellow[bgIndex]
    const bgRed = twColors.red[bgIndex]
    const borderIndex = cond(isLight, '400', '600')
    const borderGreen = twColors.green[borderIndex]
    const borderYellow = twColors.yellow[borderIndex]
    const borderRed = twColors.red[borderIndex]

    const text = twColors.gray[cond(isLight, '600', '400')]
    const border = twColors.gray[cond(isLight, '300', '700')]

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: scores,
        datasets: [
          {
            label: '',
            data: counts().map(([_, c]) => c),
            backgroundColor: [bgGreen, bgGreen, bgGreen, bgYellow, bgYellow, bgRed, bgRed],
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

  const BORDER_COLOR = 'border-gray-300 dark:border-gray-700'

  return (
    <div class="space-y-6">
      <h3 class="text-xl font-bold">Distribution</h3>

      <table class={cx('w-full border-y-2 font-mono text-xl', BORDER_COLOR)}>
        <thead class={cx('border-b-[1px]', BORDER_COLOR)}>
          <tr>
            <For each={scores}>
              {s => (
                <th class={getColorForDayScore(s)} classList={{ 'score-great-glow': s === 1 }}>
                  {s}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <tr>
            <For each={counts()}>{([_, c]) => <td>{c}</td>}</For>
          </tr>
        </tbody>
      </table>

      <div>
        <canvas ref={canvas} />
      </div>
    </div>
  )
}
