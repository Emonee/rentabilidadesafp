import { HISTORICAL_INITIAL_CHART_CONFIG } from '@/consts/charts'
import { updateChart } from '@/lib/client/charts'
import { buildHistoricalData } from '@/lib/server/data_builds'
import { Chart } from 'chart.js/auto'
import { createEffect } from 'solid-js'

type Props = {
  found: string
  monthFrom: number
  yearFrom: number
  monthTo: number
  yearTo: number
  historicalData: [string, string, string, string, string][]
}

export default function (props: Props) {
  let canvasElement: HTMLCanvasElement | undefined
  let chart: Chart | undefined
  createEffect(async () => {
    if (!canvasElement) return
    if (!chart)
      chart = new Chart(canvasElement, HISTORICAL_INITIAL_CHART_CONFIG)
    const { datasets, labels } = await buildHistoricalData({
      historicalData: props.historicalData,
      found: props.found,
      monthFrom: props.monthFrom,
      monthTo: props.monthTo,
      yearFrom: props.yearFrom,
      yearTo: props.yearTo
    })
    updateChart({ chart, newDatasets: datasets, newLabels: labels })
  })
  return <canvas ref={canvasElement} />
}
