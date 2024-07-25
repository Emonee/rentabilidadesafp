import { Chart } from 'chart.js/auto'
import { type ChartConfiguration, type ChartConfigurationCustomTypesPerDataset, type ChartDataset } from 'chart.js'

export class BaseChart extends HTMLElement {
  canvas: HTMLCanvasElement
  chart?: Chart
  constructor () {
    super()
    this.canvas = document.createElement('canvas')
  }

  drawChart (parent: HTMLElement, config: ChartConfiguration | ChartConfigurationCustomTypesPerDataset) {
    parent.appendChild(this.canvas)
    this.chart = new Chart(this.canvas, config)
  }

  updateDatasets (newDatasets: ChartDataset[]) {
    if (!this.chart) return
    this.chart.data.datasets = newDatasets
    this.chart.update()
  }
}
