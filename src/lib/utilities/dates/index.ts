import { MONTHS } from '@/consts/dates'

export function yearMonthToDate(year?: string, month?: string) {
  if (!year || !month) throw new TypeError()
  return new Date(`${year}-${month}-02`)
}

export function getMonthNameByMonth(month: number) {
  const monthName = MONTHS[month || 12]
  if (!monthName) throw new Error(`Invalid month: ${month}`)
  return monthName
}

export function monthsCountBetweenDates({
  fromDate,
  toDate = new Date()
}: {
  fromDate: Date
  toDate?: Date
}) {
  const yearsDiff = Math.abs(toDate.getFullYear() - fromDate.getFullYear())
  const monthsDiff = toDate.getMonth() - fromDate.getMonth()
  return yearsDiff * 12 + monthsDiff
}
