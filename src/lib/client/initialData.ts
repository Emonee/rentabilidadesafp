export function getBestAfpByPeriodInitialData() {
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const threeYearsBefore = new Date()
  threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
  return {
    found: 'A',
    monthFrom: threeYearsBefore.getMonth() + 1,
    yearFrom: threeYearsBefore.getFullYear(),
    monthTo: lastMonth.getMonth() + 1,
    yearTo: lastMonth.getFullYear()
  }
}
