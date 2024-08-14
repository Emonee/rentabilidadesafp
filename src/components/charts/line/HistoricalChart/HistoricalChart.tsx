import { HISTORICAL_INITIAL_CHART_CONFIG } from '@/consts/charts'
import { updateChart } from '@/lib/client/charts'
import { Chart, type ChartDataset } from 'chart.js/auto'
import { createEffect } from 'solid-js'

type Props = {
  datasets: ChartDataset[]
  labels: string[]
}

export default function (props: Props) {
  let canvasElement: HTMLCanvasElement | undefined
  let chart: Chart | undefined
  createEffect(async () => {
    if (!canvasElement) return
    if (!chart)
      chart = new Chart(canvasElement, HISTORICAL_INITIAL_CHART_CONFIG)
    updateChart({ chart, newDatasets: props.datasets, newLabels: props.labels })
  })
  return (
    <div style={{ 'min-height': '456px' }}>
      <canvas ref={canvasElement} />
    </div>
  )
}
