import type { Chart, ChartDataset } from 'chart.js'

export function updateChart({
  chart,
  newLabels,
  newDatasets
}: {
  chart: Chart
  newLabels?: string[]
  newDatasets?: ChartDataset[]
}) {
  if (newLabels) chart.data.labels = newLabels
  if (newDatasets) {
    const indexesToRemove: number[] = []
    chart.data.datasets.forEach(({ label: label1 }, index) => {
      if (!newDatasets.some(({ label }) => label === label1))
        indexesToRemove.push(index)
    })
    indexesToRemove.forEach((val, index) =>
      chart.data.datasets.splice(val - index, 1)
    )
    for (const newDataset of newDatasets) {
      const selectedDataset = chart.data.datasets.find(
        ({ label }) => label === newDataset.label
      )
      if (!selectedDataset) {
        chart.data.datasets.push(newDataset)
        continue
      }
      selectedDataset.data.forEach((_, index, array) => {
        array[index] = newDataset.data[index]
      })
      newDataset.data.forEach((data, index) => {
        if (index in selectedDataset.data) return
        selectedDataset.data.push(data)
      })
    }
  }
  chart.update()
}
