export function yearMonthToDate(year?: string, month?: string) {
  if (!year || !month) throw new TypeError()
  return new Date(`${year}-${month}-02`)
}
