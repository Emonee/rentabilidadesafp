import {
  getMonthNameByMonth,
  monthsCountBetweenDates
} from '@/lib/utilities/dates'
import '@material/web/slider/slider'
import type { MdSlider } from '@material/web/slider/slider'
import { createSignal, type JSX, onCleanup, onMount } from 'solid-js'
import './styles.css'

type Props = {
  onChange?: JSX.EventHandler<HTMLInputElement, Event>
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
  onMount(() => {
    slider?.addEventListener('input', (event) => {
      event.currentTarget
      const { valueStart, valueEnd } = slider
      const newStartDate = new Date(firstDate)
      newStartDate.setMonth((valueStart || 0) + firstDate.getMonth())
      const newEndingDate = new Date(firstDate)
      newEndingDate.setMonth((valueEnd || 0) + firstDate.getMonth())
      setInitialRangeDate(newStartDate)
      setEndingRangeDate(newEndingDate)
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        props.onChange?.(
          event as Event & { currentTarget: HTMLInputElement; target: Element }
        )
      }, 800)
    })
  })
  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })
  return (
    <>
      <p
        class="papito"
        style={{
          'text-align': 'center',
          width: 'min(400px, 100%)',
          padding: '7px',
          'border-radius': '8px',
          border: '2px solid var(--md-sys-color-primary)',
          display: 'flex',
          'justify-content': 'space-around'
        }}
      >
        <small style={{ width: '200px' }}>
          {getMonthNameByMonth(getInitialRangeDate().getMonth() + 1)}{' '}
          {getInitialRangeDate().getFullYear()}
        </small>
        <small style={{ width: '200px' }}>
          {getMonthNameByMonth(getEndingRangeDate().getMonth() + 1)}{' '}
          {getEndingRangeDate().getFullYear()}
        </small>
      </p>
      <md-slider
        range
        max={maxRange}
        ref={slider}
        attr:value-start={startValue}
        attr:value-end={maxRange}
        style={{
          width: '100%',
          'margin-bottom': 'var(--pico-typography-spacing-vertical, 1rem)'
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
    </>
  )
}
