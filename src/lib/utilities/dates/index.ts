import { MONTHS } from '@/consts/dates'

export function yearMonthToDate(year?: string, month?: string) {
  if (!year || !month) throw new TypeError()
  return new Date(`${year}-${month}-02`)
}

export function getMonthNameByMonth(month: number) {
  const monthName = MONTHS[month]
  if (!monthName) throw new Error(`Invalid month: ${month}`)
  return monthName
}
