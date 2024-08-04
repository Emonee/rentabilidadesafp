import { AFPS } from '@/consts/afp'
import ytdAccData from '@/data/ytd_12_months.json'
import Chart from 'chart.js/auto'

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
    labels: fondos,
    datasets
  }
})
