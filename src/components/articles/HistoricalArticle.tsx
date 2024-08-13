import { createSignal } from 'solid-js'
import HistoricalChart from '../charts/line/HistoricalChart/HistoricalChart'
import FoundsSelect from '../forms/selects/FoundsSelect'

type Props = {
  historicalData: [string, string, string, string, string][]
}

export default function (props: Props) {
  const [getFound, setFound] = createSignal('A')
  const now = new Date()
  const initialChartProps = {
    monthFrom: 8,
    yearFrom: 2005,
    monthTo: now.getMonth(),
    yearTo: now.getFullYear()
  }
  return (
    <article>
      <p>Fondo a visualizar:</p>
      <FoundsSelect selectedFound={getFound()} setSelectedFound={setFound} />
      <HistoricalChart
        found={getFound()}
        historicalData={props.historicalData}
        {...initialChartProps}
      />
    </article>
  )
}
