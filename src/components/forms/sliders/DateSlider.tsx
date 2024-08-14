import {
  getMonthNameByMonth,
  monthsCountBetweenDates
} from '@/lib/utilities/dates'
import '@material/web/slider/slider'
import type { MdSlider } from '@material/web/slider/slider'
import { createSignal, onMount } from 'solid-js'
import './styles.css'

export default function () {
  let slider: MdSlider | undefined
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
    slider?.addEventListener('input', () => {
      const { valueStart, valueEnd } = slider
      const newStartDate = new Date(firstDate)
      newStartDate.setMonth((valueStart || 0) + firstDate.getMonth())
      const newEndingDate = new Date(firstDate)
      newEndingDate.setMonth((valueEnd || 0) + firstDate.getMonth())
      setInitialRangeDate(newStartDate)
      setEndingRangeDate(newEndingDate)
    })
  })
  return (
    <>
      <p
        class="papito"
        style={{
          'text-align': 'center',
          width: '400px',
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
