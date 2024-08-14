import { FONDOS } from '@/consts/afp'
import { For, type JSX } from 'solid-js'
import DateSlider from '../sliders/DateSlider'

type PropType = {
  onSubmit?: JSX.EventHandler<HTMLFormElement, SubmitEvent>
  onChange?: JSX.EventHandler<HTMLSelectElement | HTMLInputElement, Event>
}

export default function FoundAndPeriodForm(props: PropType) {
  return (
    <form onSubmit={props.onSubmit || ((e) => e.preventDefault())}>
      <select style="max-width: 200px;" name="found" onChange={props.onChange}>
        <For each={FONDOS}>
          {({ name }) => <option value={name}>{name}</option>}
        </For>
      </select>
      <p>
        <b>Periodo:</b>
      </p>
      <DateSlider onChange={props.onChange} />
    </form>
  )
}
