import { BaseChart } from '@/components/charts/base/base'
import { AFPS } from '@/consts/afp'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import jsonAnnualData from '@/data/anual_returns.json'
import type { AnualReturns, Found } from '@/lib/utilities/types/index'
import type { ChartDataset } from 'chart.js'

const actualYear = new Date().getFullYear()
const firstYear = 2005

export class AnnualChart extends BaseChart {
  anualData: AnualReturns
  constructor() {
    super()
    this.anualData = jsonAnnualData
    const years = [...Array(actualYear - firstYear).keys()].map(
      (i) => firstYear + i
    )
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
            min: -50,
            max: 50,
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
              text: 'Año',
              font: {
                size: 18
              }
            }
          }
        },
        plugins: {
          tooltip: {
            itemSort: (
              { formattedValue },
              { formattedValue: formattedValue2 }
            ) => +formattedValue2 - +formattedValue,
            callbacks: {
              label: ({ dataset, formattedValue }) =>
                `${dataset.label}: ${formattedValue}%`
            }
          }
        }
      },
      data: {
        labels: years,
        datasets: this.generateData('A')
      },
      plugins: [ZERO_LINE_PLUGIN]
    })
    this.querySelector<HTMLSelectElement>('select')?.addEventListener(
      'change',
      (event) => {
        const newSelectedFondo = (event.target as HTMLSelectElement)
          ?.value as Found
        this.updateChart({ newDatasets: this.generateData(newSelectedFondo) })
      }
    )
  }
  generateData(found: Found): ChartDataset[] {
    if (!this.anualData) return []
    const datasets: ChartDataset[] = Object.entries(this.anualData).map(
      ([name, data]) => {
        const firstYearAfp = Object.keys(data)[0]
        const yearDiff = +firstYearAfp - firstYear
        return {
          label: name,
          borderColor: AFPS[name as keyof typeof AFPS].mainColor,
          backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
          data: [
            ...Array(yearDiff).fill(null),
            ...Object.values(data).map((v) => v[found])
          ],
          tension: 0.2
        }
      }
    )
    return datasets
  }
}
customElements.define('annual-chart', AnnualChart)
