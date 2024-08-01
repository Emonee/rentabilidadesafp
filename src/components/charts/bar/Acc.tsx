import { AFPS } from '@/consts/afp'
import { PUBLIC_YTD_ACC_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import type { FundSystemData } from '@/lib/utilities/types'
import Chart, { type ChartDataset } from 'chart.js/auto'
import { onMount } from 'solid-js'

export default function () {
  onMount(async () => {
    const ytdAccData = await fetchResource<FundSystemData>({
      cacheName: PUBLIC_YTD_ACC_DATA.cacheName,
      route: PUBLIC_YTD_ACC_DATA.route
    })
    const founds = ytdAccData ? Object.keys(Object.values(ytdAccData)[0]) : []
    const datasets: ChartDataset[] = Object.entries(ytdAccData || {}).map(([name, values]) => ({
      label: name,
      borderColor: AFPS[name as keyof typeof AFPS].mainColor,
      backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
      data: Object.values(values).map((v) => v.acc)
    }))
    const ctx = document.getElementById('acc') as HTMLCanvasElement | null
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        data: {
          labels: founds,
          datasets: datasets
        }
      })
    }
  })
  return (
    <article class="chart-container">
      <div>
        <canvas id="acc" />
      </div>
    </article>
  )
}
