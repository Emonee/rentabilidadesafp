import { BaseChart } from '@/components/charts/base/base'
import { AFPS } from '@/consts/afp'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import { HISTORICAL_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import { calculateAccumulatedRentability } from '@/lib/utilities/nums'
import type { ChartDataset } from 'chart.js'

const REACTIVE_ATTRIBUTES = ['data-json-props']

export class HistoricalChart extends BaseChart {
  props: { found: string; monthFrom: number; monthTo: number; yearFrom: number; yearTo: number }
  historicalDataCsvString?: string
  static observedAttributes = REACTIVE_ATTRIBUTES
  constructor() {
    super()
    const now = new Date()
    this.props = {
      found: 'A',
      monthFrom: 1,
      yearFrom: 2005,
      monthTo: now.getMonth() + 1,
      yearTo: now.getFullYear()
    }
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
              text: 'Año-Mes',
              font: {
                size: 16
              }
            }
          }
        },
        plugins: {
          tooltip: {
            itemSort: ({ formattedValue }, { formattedValue: formattedValue2 }) => +formattedValue2 - +formattedValue,
            callbacks: {
              label: ({ dataset, formattedValue }) => `${dataset.label}: ${formattedValue}%`
            }
          }
        }
      },
      data: {
        labels: [],
        datasets: []
      },
      plugins: [ZERO_LINE_PLUGIN]
    })
    this.getHistoricalData().catch(() => {})
  }

  attributeChangedCallback() {
    const { jsonProps } = this.dataset
    if (!jsonProps) return
    const newProps = JSON.parse(jsonProps) as typeof this.props
    this.props = { ...this.props, ...newProps }
    const newLabels = this.generateLabels()
    const newDatasets = this.generateDataset({ labels: newLabels })
    this.updateChart({ newLabels, newDatasets })
  }

  async getHistoricalData() {
    this.historicalDataCsvString = await fetchResource({
      cacheName: HISTORICAL_DATA.cacheName,
      route: HISTORICAL_DATA.route,
      isJson: false
    })
    const labels = this.generateLabels()
    this.updateChart({
      newLabels: labels,
      newDatasets: this.generateDataset({ labels })
    })
  }

  generateLabels() {
    const { monthFrom, monthTo, yearFrom, yearTo } = this.props
    const months = [...Array(12).keys()].map((i) => 1 + i)
    const labels: string[] = []
    if (yearFrom === yearTo) {
      for (const month of months) labels.push(`${yearFrom}-${month.toString().padStart(2, '0')}`)
      return labels
    }
    const years = [...Array(yearTo - yearFrom + 1).keys()].map((i) => yearFrom + i)
    years.forEach((year, index) => {
      const isFirstYear = index === 0
      const isLastYear = index === years.length - 1
      if (isFirstYear) {
        const months = [...Array(12 - monthFrom + 1).keys()].map((i) => i + monthFrom)
        for (const month of months) labels.push(`${year}-${month.toString().padStart(2, '0')}`)
        return
      }
      if (isLastYear) {
        const months = [...Array(monthTo).keys()].map((i) => i + 1)
        for (const month of months) labels.push(`${year}-${month.toString().padStart(2, '0')}`)
        return
      }
      for (const month of months) labels.push(`${year}-${month.toString().padStart(2, '0')}`)
    })
    return labels
  }

  generateDataset({ labels }: { labels: string[] }): ChartDataset[] {
    const content = this.historicalDataCsvString?.split('\n')
    if (!content) return []
    const datasets: {
      [key: string]: Array<number | null>
    } = {}
    for (const line of content) {
      const [afpName, month, year, found, rentability] = line.split(',')
      if (found !== this.props.found || !(afpName in AFPS)) continue
      datasets[afpName] ||= []
      const index = labels.indexOf(`${year}-${month}`)
      if (index < 0) continue
      datasets[afpName][index] = rentability === '\r' ? null : +rentability
    }
    return Object.entries(datasets).map(([label, data]) => ({
      label,
      borderColor: AFPS[label as keyof typeof AFPS].mainColor,
      backgroundColor: AFPS[label as keyof typeof AFPS].mainColor,
      data: calculateAccumulatedRentability(data),
      tension: 0.2,
      pointRadius: 0,
      pointHoverRadius: 7
    }))
  }
}
customElements.define('historical-chart', HistoricalChart)
