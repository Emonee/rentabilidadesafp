import { AFPS } from '@/consts/afp'
import { PUBLIC_YTD_ACC_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import type { FundSystemData } from '@/lib/utilities/types'
import Chart from 'chart.js/auto'

const ytdAccData = await fetchResource<FundSystemData>({
  cacheName: PUBLIC_YTD_ACC_DATA.cacheName,
  route: PUBLIC_YTD_ACC_DATA.route
})
const fondos = Object.keys(Object.values(ytdAccData)[0])
const datasets = Object.entries(ytdAccData).map(([name, values]) => ({
  label: name,
  borderColor: AFPS[name as keyof typeof AFPS].mainColor,
  backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
  data: Object.values(values).map((v) => v.ytd)
}))
new Chart(document.getElementById('ytd') as HTMLCanvasElement, {
  type: 'bar',
  options: {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rentabilidad real'
        },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fondo'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ({ dataset, formattedValue }) => `${dataset.label}: ${formattedValue}%`
        }
      }
    }
  },
  data: {
    labels: fondos,
    datasets
  }
})
