import { BaseChart } from '@/components/charts/base/base'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import { getHistoricalDataCsvString } from '@/lib/client/fetch'
import { calculateAccumulatedRentability } from '@/lib/utilities/nums'
import type { Found } from '@/lib/utilities/types'
import type { ChartDataset } from 'chart.js'

export class HistoricalChart extends BaseChart {
  labels: string[]
  historicalDataCsvString?: string
  constructor() {
    super()
    this.labels = this.generateLabels()
    this.getHistoricalData().catch(() => {})
    this.drawChart(this, {
      type: 'line',
      options: {
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        scales: {
          y: {
            max: 140,
            min: -40,
            title: {
              display: true,
              text: 'Rentabilidad real (%)',
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
              text: 'Tiempo (Año-Mes)',
              font: {
                size: 20
              }
            }
          }
        }
      },
      data: {
        labels: this.labels,
        datasets: this.generateDataset('A')
      },
      plugins: [ZERO_LINE_PLUGIN]
    })
    this.querySelector<HTMLSelectElement>('select')?.addEventListener(
      'change',
      (event) => {
        const newSelectedFondo = (event.target as HTMLSelectElement)
          ?.value as Found
        this.updateDatasets(this.generateDataset(newSelectedFondo))
      }
    )
  }

  async getHistoricalData() {
    this.historicalDataCsvString = await getHistoricalDataCsvString()
    this.updateDatasets(this.generateDataset('A'))
  }

  generateLabels() {
    const labels: string[] = []
    const firstYear = 2005
    const actualYear = new Date().getFullYear()
    const years = [...Array(actualYear - firstYear + 1).keys()].map(
      (i) => firstYear + i
    )
    const months = [...Array(12).keys()].map((i) => 1 + i)
    for (const year of years) {
      for (const month of months)
        labels.push(`${year}-${month.toString().padStart(2, '0')}`)
    }
    return labels
  }

  generateDataset(selectFound: Found): ChartDataset[] {
    const content = this.historicalDataCsvString?.split('\n')
    if (!content) return []
    const datasets: {
      [key: string]: Array<number | null>
    } = {}
    for (const line of content) {
      const [afpName, month, year, found, rentability] = line.split(',')
      if (found !== selectFound) continue
      datasets[afpName] ||= []
      const index = this.labels.indexOf(`${year}-${month}`)
      if (index < 0) continue
      datasets[afpName][index] = rentability === '\r' ? null : +rentability
    }
    return Object.entries(datasets).map(([label, data]) => ({
      label,
      data: calculateAccumulatedRentability(data),
      tension: 0.2,
      pointRadius: 0,
      pointHoverRadius: 7
    }))
  }
}
customElements.define('historical-chart', HistoricalChart)
