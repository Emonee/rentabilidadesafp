import { getColor } from '@/lib/utilities/nums'
import { For } from 'solid-js'

type Props = {
  tableRows: Array<{ name: string; value: number }>
}

export default function BestAfpByYTDTable(props: Props) {
  return (
    <table style="max-width: 500px;">
      <tbody>
        <For each={props.tableRows}>
          {({ name, value }) => {
            const color = getColor(10, -10, value)
            const colorStyle = `4px solid ${color}`
            return (
              <tr>
                <td style={{ 'border-left': colorStyle }}>{name}</td>
                <td
                  style={{
                    'border-left': colorStyle,
                    'border-right': colorStyle
                  }}
                >
                  {value}%
                </td>
              </tr>
            )
          }}
        </For>
      </tbody>
    </table>
  )
}
