import { FONDOS } from '@/consts/afp'
import { For, type Setter } from 'solid-js'

type Props = {
  selectedFound: string
  setSelectedFound: Setter<string>
}

export default function FoundsSelect(props: Props) {
  return (
    <select
      style="max-width: 200px;"
      value={props.selectedFound}
      onChange={(e) => props.setSelectedFound(e.target.value)}
    >
      <For each={FONDOS}>
        {({ name }) => <option value={name}>{name}</option>}
      </For>
    </select>
  )
}
