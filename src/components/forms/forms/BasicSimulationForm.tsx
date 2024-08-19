import type { JSX } from 'solid-js'

type Props = {
  onSubmit: JSX.EventHandler<HTMLFormElement, Event>
}

export default function (props: Props) {
  return (
    <form onSubmit={props.onSubmit}>
      <input
        type="number"
        min="1"
        name="net_salary"
        value={1_000_000}
        placeholder="Sueldo líquido"
        required
      />
      <button type="submit">Simular</button>
    </form>
  )
}
