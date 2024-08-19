import BasicSimulationMethod from '@/components/articles/BasicSimulationMethod'
import BasicSimulationForm from '@/components/forms/forms/BasicSimulationForm'
import BasicSimulationResultsSection from '@/components/sections/BasicSimulationResultsSection'
import type { CsvData } from '@/lib/utilities/types'
import { createSignal, Show, type JSX } from 'solid-js'

type Props = {
  historicalData: CsvData
}

export default function (props: Props) {
  const [getNetSalary, setNetSalary] = createSignal<number | null>(1000000)
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
      <BasicSimulationForm onSubmit={onSubmit} />
      <Show when={getNetSalary() != null}>
        <BasicSimulationResultsSection
          netSalary={getNetSalary() as number}
          historicalData={props.historicalData}
        />
        <BasicSimulationMethod />
      </Show>
    </>
  )
}
