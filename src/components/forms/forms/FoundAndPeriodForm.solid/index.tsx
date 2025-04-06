import { FONDOS } from '@/consts/afp'
import type { MdSlider } from '@material/web/slider/slider'
import { For, type JSX } from 'solid-js'
import { MONTHS, YEARS } from '@/consts/dates'
import { getBestAfpByPeriodInitialData } from '@/lib/client/initialData'
import styles from './style.module.css'
const { monthFrom, monthTo, yearFrom, yearTo } = getBestAfpByPeriodInitialData()

type PropType = {
  onSubmit?: JSX.EventHandler<HTMLFormElement, SubmitEvent>
  onChange?: JSX.EventHandler<
    HTMLSelectElement | HTMLInputElement | MdSlider,
    Event
  >
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

      <div class={styles.container}>
        <p class={styles.margin0}>Desde</p>
        <select
          name="monthFrom"
          onChange={props.onChange}
          class={`${styles.select} ${styles.margin0}`}
        >
          <For each={Object.entries(MONTHS)}>
            {([month, monthName]) => (
              <option value={month} selected={+month === monthFrom}>
                {monthName}
              </option>
            )}
          </For>
        </select>
        <p class={styles.margin0}>del</p>
        <select
          name="yearFrom"
          onChange={props.onChange}
          class={`${styles.select} ${styles.margin0}`}
        >
          <For each={YEARS}>
            {(year) => (
              <option value={year} selected={+year === yearFrom}>
                {year}
              </option>
            )}
          </For>
        </select>
      </div>

      <div class={styles.container}>
        <p class={styles.margin0}>Hasta</p>
        <select
          name="monthTo"
          onChange={props.onChange}
          class={`${styles.select} ${styles.margin0}`}
        >
          <For each={Object.entries(MONTHS)}>
            {([month, monthName]) => (
              <option value={month} selected={+month === monthTo}>
                {monthName}
              </option>
            )}
          </For>
        </select>
        <p class={styles.margin0}>del</p>
        <select
          name="yearTo"
          onChange={props.onChange}
          class={`${styles.select} ${styles.margin0}`}
        >
          <For each={YEARS}>
            {(year) => (
              <option value={year} selected={+year === yearTo}>
                {year}
              </option>
            )}
          </For>
        </select>
      </div>
    </form>
  )
}
