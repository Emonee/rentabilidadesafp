import '@/components/charts/line/HistoricalChart/script'
import type { HistoricalChart } from '@/components/charts/line/HistoricalChart/script'
import FoundAndPeriodForm from '@/components/forms/forms/FoundAndPeriodForm.solid'
import '@/components/tables/BestAFPByPeriodTable/script'
import type { BestAfpByPeriodTable } from '@/components/tables/BestAFPByPeriodTable/script'
import { buildHistoricalData } from '@/lib/server/data_builds'
import { For, type JSX, Show, createSignal, onMount } from 'solid-js'

export default function BestAfpByPeriodSection(props: {
  historicalData: Array<[string, string, string, string, string]>
}) {
  const [bestAfp, setBestAfp] = createSignal<string>('')
  const [afpsOutOfPeriod, setAfpsOutOfPeriod] = createSignal<string[]>([])
  let historicalChart!: HistoricalChart
  let bestAfpsPeriodTable!: BestAfpByPeriodTable
  const buildTableAndChart = ({
    found,
    monthFrom,
    yearFrom,
    monthTo,
    yearTo
  }: {
    found: string
    monthFrom: number
    monthTo: number
    yearFrom: number
    yearTo: number
  }) => {
    buildHistoricalData({
      historicalData: props.historicalData,
      found,
      monthFrom,
      yearFrom,
      monthTo,
      yearTo
    }).then(({ labels, datasets, afpsOutOfPeriod, tableData }) => {
      const filteredDatasets = datasets.filter(({ data }) =>
        data.every((d) => d != null)
      )
      tableData.length ? setBestAfp(tableData[0][0]) : setBestAfp('')
      setAfpsOutOfPeriod([...afpsOutOfPeriod])
      bestAfpsPeriodTable.setAttribute(
        'data-table-rows',
        JSON.stringify(tableData)
      )
      historicalChart.updateChart({
        newDatasets: filteredDatasets,
        newLabels: labels
      })
    })
  }
  onMount(() => {
    const now = new Date()
    const threeYearsBefore = new Date()
    threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
    threeYearsBefore.setMonth(threeYearsBefore.getMonth() + 1)
    buildTableAndChart({
      found: 'A',
      monthFrom: threeYearsBefore.getMonth(),
      yearFrom: threeYearsBefore.getFullYear(),
      monthTo: now.getMonth(),
      yearTo: now.getFullYear()
    })
  })
  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
    event
  ) => {
    event.preventDefault()
    const { found, monthFrom, monthTo, yearFrom, yearTo } = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    )
    if (
      typeof found !== 'string' ||
      typeof monthFrom !== 'string' ||
      typeof monthTo !== 'string' ||
      typeof yearFrom !== 'string' ||
      typeof yearTo !== 'string'
    )
      return
    buildTableAndChart({
      found,
      monthFrom: +monthFrom,
      monthTo: +monthTo,
      yearFrom: +yearFrom,
      yearTo: +yearTo
    })
  }
  return (
    <section>
      <h2>Mejor AFP por periodo y fondo: {bestAfp()}</h2>
      <p>
        Corresponde al raking por rentabilidad real acumulada desde el periodo y
        fondo seleccionado.
      </p>
      <article class="chart-container">
        <p>
          <b>Fondo a visualizar:</b>
        </p>
        <FoundAndPeriodForm onSubmit={handleSubmit} />
        <best-afp-by-period-table ref={bestAfpsPeriodTable}>
          <table>
            <tbody />
          </table>
        </best-afp-by-period-table>
        <historical-chart
          ref={historicalChart}
          style={{ display: bestAfp() ? 'block' : 'none' }}
        />
        <Show when={afpsOutOfPeriod().length}>
          <p>
            Las siguientes AFP quedaron fuera del ranking por no existir dentro
            del periodo completo:
          </p>
          <ul>
            <For each={afpsOutOfPeriod()}>{(afp) => <li>{afp}</li>}</For>
          </ul>
        </Show>
      </article>
    </section>
  )
}
