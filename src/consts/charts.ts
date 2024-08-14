import type { Chart, ChartConfiguration } from 'chart.js'

export const ZERO_LINE_PLUGIN = {
  id: 'zeroLine', // Custom ID for the plugin
  beforeDatasetsDraw(chart: Chart) {
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

export const HISTORICAL_INITIAL_CHART_CONFIG: ChartConfiguration = {
  type: 'line',
  options: {
    maintainAspectRatio: false,
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
            size: 18
          }
        }
      }
    },
    plugins: {
      tooltip: {
        itemSort: ({ formattedValue }, { formattedValue: formattedValue2 }) =>
          +formattedValue2 - +formattedValue,
        callbacks: {
          label: ({ dataset, formattedValue }) =>
            `${dataset.label}: ${formattedValue}%`
        }
      }
    }
  },
  data: {
    labels: [],
    datasets: []
  },
  plugins: [ZERO_LINE_PLUGIN]
}
