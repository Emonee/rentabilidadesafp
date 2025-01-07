import HistoricalChart from '@/components/charts/line/HistoricalChart/HistoricalChart'
import FoundAndPeriodForm from '@/components/forms/forms/FoundAndPeriodForm.solid'
import BestAFPByPeriodTable from '@/components/tables/BestAFPByPeriodTable'
import { buildHistoricalData } from '@/lib/server/data_builds'
import type { MdSlider } from '@material/web/slider/slider'
import type { ChartDataset } from 'chart.js'
import { For, type JSX, Show, createSignal, onMount } from 'solid-js'

export default function BestAfpByPeriodSection(props: {
  historicalData: Array<[string, string, string, string, string]>
}) {
  const [bestAfp, setBestAfp] = createSignal<string>('')
  const [afpsOutOfPeriod, setAfpsOutOfPeriod] = createSignal<string[]>([])
  const [getTableRows, setTableRows] = createSignal<[string, number][]>([])
  const [getDatasets, setDatasets] = createSignal<ChartDataset[]>([])
  const [getLabels, setLabels] = createSignal<string[]>([])
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
    const { labels, datasets, afpsOutOfPeriod, tableData } =
      buildHistoricalData({
        historicalData: props.historicalData,
        found,
        monthFrom,
        yearFrom,
        monthTo,
        yearTo
      })
    const filteredDatasets = datasets.filter(({ data }) =>
      data.every((d) => d != null)
    )
    tableData.length ? setBestAfp(tableData[0][0]) : setBestAfp('')
    setAfpsOutOfPeriod([...afpsOutOfPeriod])
    setTableRows(tableData)
    setDatasets(filteredDatasets)
    setLabels(labels)
  }
  onMount(() => {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const threeYearsBefore = new Date()
    threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
    buildTableAndChart({
      found: 'A',
      monthFrom: threeYearsBefore.getMonth() + 1,
      yearFrom: threeYearsBefore.getFullYear(),
      monthTo: lastMonth.getMonth() + 1,
      yearTo: lastMonth.getFullYear()
    })
  })
  const onChange: JSX.EventHandler<
    HTMLSelectElement | HTMLInputElement | MdSlider,
    Event
  > = (event) => {
    const form = (event.target as HTMLSelectElement | HTMLInputElement)
      .form as HTMLFormElement
    const { found, monthFrom, monthTo, yearFrom, yearTo } = Object.fromEntries(
      new FormData(form)
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
        <FoundAndPeriodForm onChange={onChange} />
        <BestAFPByPeriodTable rows={getTableRows()} />
        <HistoricalChart datasets={getDatasets()} labels={getLabels()} />
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
