import type {
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartDataset
} from 'chart.js'
import { Chart } from 'chart.js/auto'

export class BaseChart extends HTMLElement {
  canvas: HTMLCanvasElement
  chart?: Chart
  constructor() {
    super()
    this.canvas = document.createElement('canvas')
  }

  drawChart(
    parent: HTMLElement,
    config: ChartConfiguration | ChartConfigurationCustomTypesPerDataset
  ) {
    parent.style.setProperty('display', 'block')
    parent.appendChild(this.canvas)
    this.chart = new Chart(this.canvas, config)
  }

  updateDatasets(newDatasets: ChartDataset[]) {
    if (!this.chart) return
    this.chart.data.datasets = newDatasets
    this.chart.update()
  }

  updateChart({
    newLabels,
    newDatasets
  }: {
    newLabels?: string[]
    newDatasets?: ChartDataset[]
  }) {
    if (!this.chart) return
    if (newLabels) this.chart.data.labels = newLabels
    if (newDatasets) {
      const indexesToRemove: number[] = []
      this.chart.data.datasets.forEach(({ label: label1 }, index) => {
        if (!newDatasets.some(({ label }) => label === label1))
          indexesToRemove.push(index)
      })
      indexesToRemove.forEach((val, index) =>
        this.chart?.data.datasets.splice(val - index, 1)
      )
      for (const dataset of newDatasets) {
        const selectedDataset = this.chart.data.datasets.find(
          ({ label }) => label === dataset.label
        )
        if (!selectedDataset) {
          this.chart.data.datasets.push(dataset)
          continue
        }
        selectedDataset.data.forEach((_, index, array) => {
          array[index] = dataset.data[index]
        })
      }
    }
    this.chart.update()
  }
}
