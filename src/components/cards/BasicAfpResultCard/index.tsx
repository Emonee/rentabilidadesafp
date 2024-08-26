import { AFPS } from '@/consts/afp'
import { formatNumber } from '@/lib/utilities/nums'
import type { BasicAfpSimulationResult } from '@/lib/utilities/types'
import { Show } from 'solid-js'
import styles from './styles.module.css'

type Props = {
  afp: BasicAfpSimulationResult
  place?: number
}

export default function (props: Props) {
  return (
    <article class={styles.article}>
      <header
        style={{
          '--pico-card-sectioning-background-color':
            AFPS[props.afp.afpName as keyof typeof AFPS].secondaryColor
        }}
      >
        <Show when={props.place != null}>
          <span
            style={{
              color:
                AFPS[props.afp.afpName as keyof typeof AFPS].fullOpacityColor
            }}
          >
            <b>{props.place}º</b>
          </span>
        </Show>
        <b>{props.afp.afpName}</b>
      </header>
      <p class={styles.pensionSmallTitle}>
        <small>Pensión mensual:</small>
      </p>
      <p class={styles.pensionValue}>
        ${formatNumber(props.afp.estimatedPension)}
      </p>
      <p>
        Proporción del sueldo: {props.afp.salaryPensionProportion.toFixed(1)}%
      </p>
      <p>Rentabilidad mensual promedio: {props.afp.avgReturn}%</p>
      <p>Rentabilidad acumulada: {props.afp.accReturn}%</p>
      <p>Total acumulado: ${formatNumber(props.afp.accTotal)}</p>
    </article>
  )
}
