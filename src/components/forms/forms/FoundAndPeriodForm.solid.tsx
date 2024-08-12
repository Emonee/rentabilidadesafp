import { FONDOS } from '@/consts/afp'
import { getMonthNameByMonth } from '@/lib/utilities/dates'
import { For, type JSX } from 'solid-js'

type PropType = {
  onSubmit?: JSX.EventHandler<HTMLFormElement, SubmitEvent>
}

export default function FoundAndPeriodForm(props: PropType) {
  const firstYear = 2005
  const now = new Date()
  const threeYearsBefore = new Date()
  threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
  threeYearsBefore.setMonth(threeYearsBefore.getMonth() + 1)
  const months = [...Array(12).keys()].map((_, i) => i + 1)
  const years = [...Array(now.getFullYear() - firstYear + 1).keys()].map(
    (_, i) => i + firstYear
  )
  const defaultOnSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
    e
  ) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={props.onSubmit || defaultOnSubmit}>
      <select style="max-width: 200px;" name="found">
        <For each={FONDOS}>
          {({ name }) => <option value={name}>{name}</option>}
        </For>
      </select>
      <p>
        <b>Periodo:</b>
      </p>
      <div role="group" style="display: flex; align-items: center;">
        <p style="margin: 0 10px 0 0;">Desde</p>
        <select name="monthFrom">
          <For each={months}>
            {(month) => (
              <option
                value={month.toString().padStart(2, '0')}
                selected={threeYearsBefore.getMonth() === month}
              >
                {getMonthNameByMonth(month)}
              </option>
            )}
          </For>
        </select>
        <select name="yearFrom">
          <For each={years}>
            {(year) => (
              <option
                value={year}
                selected={threeYearsBefore.getFullYear() === year}
              >
                {year}
              </option>
            )}
          </For>
        </select>
      </div>
      <div role="group" style="display: flex; align-items: center;">
        <p style="margin: 0 10px 0 0;">Hasta</p>
        <select name="monthTo">
          <For each={months}>
            {(month) => (
              <option
                value={month.toString().padStart(2, '0')}
                selected={now.getMonth() === month}
              >
                {getMonthNameByMonth(month)}
              </option>
            )}
          </For>
        </select>
        <select name="yearTo">
          <For each={years}>
            {(year) => (
              <option value={year} selected={now.getFullYear() === year}>
                {year}
              </option>
            )}
          </For>
        </select>
      </div>
      <button type="submit">Calcular</button>
    </form>
  )
}
