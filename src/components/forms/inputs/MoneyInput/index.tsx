import { formatNumber } from '@/lib/utilities/nums'
import { createSignal, type JSX } from 'solid-js'

type Props = {
  inicialValue?: number
  labelInputAttributes?: JSX.InputHTMLAttributes<HTMLInputElement>
  hiddenInputAttributes?: JSX.InputHTMLAttributes<HTMLInputElement>
}

export default function (props: Props) {
  const [getValue, setValue] = createSignal(props.inicialValue || 0)

  const onInput: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    const { value } = event.currentTarget
    const numeric = Number(value.replace(/\D/g, ''))
    setValue(numeric)
    event.currentTarget.value = `$ ${formatNumber(getValue())}`
  }

  return (
    <>
      <input
        {...props.labelInputAttributes}
        type="text"
        value={`$ ${formatNumber(getValue())}`}
        onInput={onInput}
      />
      <input
        {...props.hiddenInputAttributes}
        type="hidden"
        value={getValue()}
      />
    </>
  )
}
