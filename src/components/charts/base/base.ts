import type { ChartConfiguration, ChartConfigurationCustomTypesPerDataset, ChartDataset } from 'chart.js'
import { Chart } from 'chart.js/auto'

export class BaseChart extends HTMLElement {
  canvas: HTMLCanvasElement
  chart?: Chart
  constructor() {
    super()
    this.canvas = document.createElement('canvas')
  }

  drawChart(parent: HTMLElement, config: ChartConfiguration | ChartConfigurationCustomTypesPerDataset) {
    parent.appendChild(this.canvas)
    this.chart = new Chart(this.canvas, config)
  }

  updateDatasets(newDatasets: ChartDataset[]) {
    if (!this.chart) return
    this.chart.data.datasets = newDatasets
    this.chart.update()
  }

  updateChart({ newLabels, newDatasets }: { newLabels?: string[]; newDatasets?: ChartDataset[] }) {
    if (!this.chart) return
    if (newLabels) this.chart.data.labels = newLabels
    if (newDatasets) this.chart.data.datasets = newDatasets
    this.chart.update()
  }
}
