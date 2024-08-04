import { AFPS } from '@/consts/afp'
import ytdAccData from '@/data/ytd_12_months.json'
import Chart, { type ChartDataset } from 'chart.js/auto'
import { onMount } from 'solid-js'

export default function () {
  onMount(async () => {
    const founds = ytdAccData ? Object.keys(Object.values(ytdAccData)[0]) : []
    const datasets: ChartDataset[] = Object.entries(ytdAccData || {}).map(
      ([name, values]) => ({
        label: name,
        borderColor: AFPS[name as keyof typeof AFPS].mainColor,
        backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
        data: Object.values(values).map((v) => v.acc)
      })
    )
    const ctx = document.getElementById('acc') as HTMLCanvasElement | null
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rentabilidad real',
                font: {
                  size: 18
                }
              },
              ticks: {
                callback: (value) => `${value}%`
              }
            },
            x: {
              title: {
                display: true,
                text: 'Fondo',
                font: {
                  size: 18
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: ({ dataset, formattedValue }) =>
                  `${dataset.label}: ${formattedValue}%`
              }
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
