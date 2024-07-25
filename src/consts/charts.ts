import type { Chart } from 'chart.js'

export const ZERO_LINE_PLUGIN = {
  id: 'zeroLine', // Custom ID for the plugin
  beforeDatasetsDraw (chart: Chart) {
    const yScale = chart.scales.y
    const ctx = chart.ctx
    const yValue = yScale.getPixelForValue(0) // Get the pixel value for zero on the Y-axis
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(chart.chartArea.left, yValue) // Start drawing from the left of the chart
    ctx.lineTo(chart.chartArea.right, yValue) // Draw to the right of the chart
    ctx.lineWidth = 2 // Set line width
    ctx.strokeStyle = 'rgba(180, 0, 0, 0.3)' // Set line color
    ctx.stroke()
    ctx.restore()
  }
}
