import type { JSX } from 'solid-js'
import MoneyInput from '../inputs/MoneyInput'

type Props = {
  onSubmit: JSX.EventHandler<HTMLFormElement, Event>
  initialValue?: number
}

export default function (props: Props) {
  return (
    <form onSubmit={props.onSubmit}>
      <MoneyInput
        inicialValue={props.initialValue}
        labelInputAttributes={{ placeholder: 'Sueldo líquido', required: true }}
        hiddenInputAttributes={{ name: 'net_salary' }}
      />
      <button type="submit">Simular</button>
    </form>
  )
}
