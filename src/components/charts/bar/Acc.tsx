import { AFPS } from '@/consts/afp'
import ytdAccData from '@/data/ytd_12_months.json'
import Chart, { type ChartDataset } from 'chart.js/auto'
import { onMount } from 'solid-js'

export default function () {
  let chart!: HTMLCanvasElement
  const founds = ytdAccData ? Object.keys(Object.values(ytdAccData)[0]) : []
  const datasets: ChartDataset[] = Object.entries(ytdAccData || {}).map(
    ([name, values]) => ({
      label: name,
      borderColor: AFPS[name as keyof typeof AFPS].mainColor,
      backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
      data: Object.values(values).map((v) => v.acc)
    })
  )
  onMount(() => {
    if (!chart) return
    new Chart(chart, {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
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
  })
  return (
    <article class="chart-container">
      <div style={{ 'min-height': '456px' }}>
        <canvas id="acc" ref={chart} />
      </div>
    </article>
  )
}
