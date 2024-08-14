import { FONDOS } from '@/consts/afp'
import { For, type JSX } from 'solid-js'
import DateSlider from '../sliders/DateSlider'

type PropType = {
  onSubmit?: JSX.EventHandler<HTMLFormElement, SubmitEvent>
}

export default function FoundAndPeriodForm(props: PropType) {
  const defaultOnSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
    e
  ) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={props.onSubmit || defaultOnSubmit}>
      <select style="max-width: 200px;" name="found">
        <For each={FONDOS}>
          {({ name }) => <option value={name}>{name}</option>}
        </For>
      </select>
      <p>
        <b>Periodo:</b>
      </p>
      <DateSlider />
      <button type="submit">Calcular</button>
    </form>
  )
}
