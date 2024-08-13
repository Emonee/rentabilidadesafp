import { getColor } from '@/lib/utilities/nums'
import { For } from 'solid-js'

type Props = {
  rows: Array<[string, number]>
}

export default function (props: Props) {
  return (
    <table>
      <tbody>
        <For each={props.rows}>
          {([afpName, returnValue]) => {
            const color = getColor(100, -100, returnValue, false, true)
            return (
              <tr>
                <td
                  style={{
                    'border-left': `4px solid ${color}`
                  }}
                >
                  {afpName}
                </td>
                <td
                  style={{
                    'text-align': 'center',
                    'border-left': `4px solid ${color}`,
                    'border-right': `4px solid ${color}`
                  }}
                >
                  {`${returnValue.toString().padEnd(4, '0')}%`}
                </td>
              </tr>
            )
          }}
        </For>
      </tbody>
    </table>
  )
}
