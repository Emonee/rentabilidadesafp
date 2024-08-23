import SimulationAlert from '@/components/alerts/SimulationAlert'
import BasicSimulationForm from '@/components/forms/forms/BasicSimulationForm'
import BasicSimulationResultsSection from '@/components/sections/BasicSimulationResultsSection'
import type { CsvData } from '@/lib/utilities/types'
import { createSignal, Show, type JSX } from 'solid-js'

type Props = {
  historicalData: CsvData
}

const INITIAL_INPUT_VALUE = 900_000

export default function (props: Props) {
  const [getNetSalary, setNetSalary] = createSignal<number | null>(null)
  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newNetSalary = Number(formData.get('net_salary'))
    const invalidSalary = isNaN(newNetSalary)
    if (invalidSalary) return
    setNetSalary(newNetSalary)
  }
  return (
    <>
      <BasicSimulationForm
        onSubmit={onSubmit}
        initialValue={INITIAL_INPUT_VALUE}
      />
      <Show when={getNetSalary() != null}>
        <div style={{ width: 'fit-content', margin: '0 auto' }}>
          <SimulationAlert />
        </div>
        <BasicSimulationResultsSection
          netSalary={getNetSalary() as number}
          historicalData={props.historicalData}
        />
      </Show>
    </>
  )
}
