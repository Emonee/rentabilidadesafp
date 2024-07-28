import { PUBLIC_YTD_ACC_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import type { FundSystemData } from '@/lib/utilities/types'
import Chart from 'chart.js/auto'
import { createResource, onCleanup, onMount } from 'solid-js'

export default function () {
  onMount(async () => {
    const ytdAccData = await fetchResource<FundSystemData>({
      cacheName: PUBLIC_YTD_ACC_DATA.cacheName,
      route: PUBLIC_YTD_ACC_DATA.route
    })
    const fondos = () => (ytdAccData ? Object.keys(Object.values(ytdAccData)[0]) : [])
    const datasets = () =>
      Object.entries(ytdAccData || {}).map(([name, values]) => ({
        label: name,
        data: Object.values(values).map((v) => v.acc)
      }))
    const ctx = document.getElementById('acc') as HTMLCanvasElement | null
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        data: {
          labels: fondos(),
          datasets: datasets()
        }
      })

      onCleanup(() => {
        chart.destroy()
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
