import BasicAfpResultCard from '@/components/cards/BasicAfpResultCard'
import type { BasicAfpSimulationResult } from '@/lib/utilities/types'
import { For } from 'solid-js'
import styles from './styles.module.css'

type Props = {
  afps: BasicAfpSimulationResult[]
}

export default function (props: Props) {
  return (
    <section class={styles.container}>
      <For each={props.afps}>
        {(afp, getIndex) => (
          <BasicAfpResultCard afp={afp} place={getIndex() + 1} />
        )}
      </For>
    </section>
  )
}
