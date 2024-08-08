import FoundsSelect from '@/components/forms/selects/FoundsSelect'
import { AFPS } from '@/consts/afp'
import { ZERO_LINE_PLUGIN } from '@/consts/charts'
import jsonAnnualData from '@/data/anual_returns.json'
import type { Found } from '@/lib/utilities/types'
import { Chart } from 'chart.js/auto'
import { createEffect, createSignal } from 'solid-js'

export default function AnnualChart() {
  let chartCanvas!: HTMLCanvasElement
  let chart: Chart

  const [getSelectedFound, setSelectedFound] = createSignal('A')
  const actualYear = new Date().getFullYear()
  const firstYear = 2005
  const years = Array.from(
    { length: actualYear - firstYear },
    (_, i) => firstYear + i
  )

  const getDatasets = () =>
    Object.entries(jsonAnnualData).map(([name, data]) => {
      const firstYearAfp = parseInt(Object.keys(data)[0])
      const yearDiff = firstYearAfp - firstYear
      const datasetData = [
        ...Array(yearDiff).fill(null),
        ...Object.values(data).map((v) => v[getSelectedFound() as Found])
      ]

      return {
        label: name,
        borderColor: AFPS[name as keyof typeof AFPS].mainColor,
        backgroundColor: AFPS[name as keyof typeof AFPS].mainColor,
        data: datasetData,
        tension: 0.2
      }
    })

  createEffect(() => {
    if (!chart) {
      chart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: years,
          datasets: getDatasets()
        },
        options: {
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          scales: {
            y: {
              min: -50,
              max: 50,
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
                text: 'Año',
                font: {
                  size: 18
                }
              }
            }
          },
          plugins: {
            tooltip: {
              itemSort: (
                { formattedValue },
                { formattedValue: formattedValue2 }
              ) => parseFloat(formattedValue2) - parseFloat(formattedValue),
              callbacks: {
                label: ({ dataset, formattedValue }) =>
                  `${dataset.label}: ${formattedValue}%`
              }
            }
          }
        },
        plugins: [ZERO_LINE_PLUGIN]
      })
    } else {
      chart.data.datasets = getDatasets()
      chart.update()
    }
  })

  return (
    <>
      <FoundsSelect
        selectedFound={getSelectedFound()}
        setSelectedFound={setSelectedFound}
      />
      <div>
        <canvas ref={chartCanvas} />
      </div>
    </>
  )
}
