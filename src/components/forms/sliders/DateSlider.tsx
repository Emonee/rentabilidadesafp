import {
  getMonthNameByMonth,
  monthsCountBetweenDates
} from '@/lib/utilities/dates'
import '@material/web/slider/slider'
import type { MdSlider } from '@material/web/slider/slider'
import { createSignal, type JSX, onCleanup } from 'solid-js'
import styles from './styles.module.css'

type Props = {
  onChange?: JSX.EventHandler<MdSlider, Event>
}

export default function (props: Props) {
  let slider: MdSlider | undefined
  let timeoutId: NodeJS.Timeout
  const firstDate = new Date('2005-08-11')
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const threeYearsBefore = new Date()
  threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
  const [getInitialRangeDate, setInitialRangeDate] =
    createSignal(threeYearsBefore)
  const [getEndingRangeDate, setEndingRangeDate] = createSignal(lastMonth)
  const maxRange = monthsCountBetweenDates({ fromDate: firstDate }) - 1
  const startValue = monthsCountBetweenDates({
    fromDate: firstDate,
    toDate: threeYearsBefore
  })
  const onInput: JSX.EventHandler<MdSlider, Event> = (event) => {
    const { valueStart, valueEnd } = event.currentTarget
    const newStartDate = new Date(firstDate)
    newStartDate.setMonth((valueStart || 0) + firstDate.getMonth())
    const newEndingDate = new Date(firstDate)
    newEndingDate.setMonth((valueEnd || 0) + firstDate.getMonth())
    setInitialRangeDate(newStartDate)
    setEndingRangeDate(newEndingDate)
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      props.onChange?.(event)
    }, 800)
  }
  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })
  return (
    <div class={styles.container}>
      <p>
        <small>
          <span style={{ width: '100px', 'text-align': 'right' }}>
            {getMonthNameByMonth(getInitialRangeDate().getMonth() + 1)}
          </span>
          <span>{getInitialRangeDate().getFullYear()},</span>
        </small>
        <small>
          <span style={{ width: '100px', 'text-align': 'right' }}>
            {getMonthNameByMonth(getEndingRangeDate().getMonth() + 1)}
          </span>
          <span>{getEndingRangeDate().getFullYear()}</span>
        </small>
      </p>
      <md-slider
        range
        max={maxRange}
        ref={slider}
        on:input={onInput}
        attr:value-start={startValue}
        attr:value-end={maxRange}
        style={{
          width: '100%'
        }}
      />
      <input
        type="hidden"
        name="monthFrom"
        value={(getInitialRangeDate().getMonth() + 1)
          .toString()
          .padStart(2, '0')}
      />
      <input
        type="hidden"
        name="yearFrom"
        value={getInitialRangeDate().getFullYear()}
      />
      <input
        type="hidden"
        name="monthTo"
        value={(getEndingRangeDate().getMonth() + 1)
          .toString()
          .padStart(2, '0')}
      />
      <input
        type="hidden"
        name="yearTo"
        value={getEndingRangeDate().getFullYear()}
      />
    </div>
  )
}
