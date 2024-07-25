import { BaseChart } from '@/components/charts/base/base'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import anualData from '@/json_data/anual.json'
import type { Found } from '@/lib/utilities/types/index'

const actualYear = new Date().getFullYear()
const firstYear = 2005

export class AnnualChart extends BaseChart {
  constructor() {
    super()
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
    this.querySelector<HTMLSelectElement>('select')?.addEventListener(
      'change',
      (event) => {
        const newSelectedFondo = (event.target as HTMLSelectElement)
          ?.value as Found
        this.updateDatasets(this.generateData(newSelectedFondo))
      }
    )
  }

  generateData(found: Found) {
    const datasets = Object.entries(anualData).map(([name, data]) => {
      const firstYearAfp = Object.keys(data)[0]
      const yearDiff = +firstYearAfp - firstYear
      return {
        label: name,
        data: [
          ...Array(yearDiff).fill(null),
          ...Object.values(data).map((v) => v[found])
        ],
        tension: 0.2
      }
    })
    return datasets
  }
}
customElements.define('annual-chart', AnnualChart)
