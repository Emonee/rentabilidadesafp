import { BaseChart } from '@/components/charts/base/base'
import { AFPS } from '@/consts/afp'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import { PUBLIC_ANNUAL_RETURNS_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import type { AnualReturns, Found } from '@/lib/utilities/types/index'
import type { ChartDataset } from 'chart.js'

const actualYear = new Date().getFullYear()
const firstYear = 2005

export class AnnualChart extends BaseChart {
  anualData?: AnualReturns
  constructor() {
    super()
    const years = [...Array(actualYear - firstYear).keys()].map((i) => firstYear + i)
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
            max: 50
          }
        }
      },
      data: {
        labels: years,
        datasets: this.generateData('A')
      },
      plugins: [ZERO_LINE_PLUGIN]
    })
    this.getAnnualData()
    this.querySelector<HTMLSelectElement>('select')?.addEventListener('change', (event) => {
      const newSelectedFondo = (event.target as HTMLSelectElement)?.value as Found
      this.updateDatasets(this.generateData(newSelectedFondo))
    })
  }
  generateData(found: Found): ChartDataset[] {
    if (!this.anualData) return []
    const datasets: ChartDataset[] = Object.entries(this.anualData).map(([name, data]) => {
      const firstYearAfp = Object.keys(data)[0]
      const yearDiff = +firstYearAfp - firstYear
      return {
        label: name,
        borderColor: AFPS[name as keyof typeof AFPS].mainColor,
        backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
        data: [...Array(yearDiff).fill(null), ...Object.values(data).map((v) => v[found])],
        tension: 0.2
      }
    })
    return datasets
  }
  async getAnnualData() {
    this.anualData = await fetchResource<AnualReturns>({
      cacheName: PUBLIC_ANNUAL_RETURNS_DATA.cacheName,
      route: PUBLIC_ANNUAL_RETURNS_DATA.route
    })
    this.updateDatasets(this.generateData('A'))
  }
}
customElements.define('annual-chart', AnnualChart)
