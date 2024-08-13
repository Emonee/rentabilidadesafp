import { AFPS } from '@/consts/afp'
import { yearMonthToDate } from '@/lib/utilities/dates'
import {
  calculateAccumulatedRentability,
  getRetability
} from '@/lib/utilities/nums'
import type { ChartDataset } from 'chart.js'

export function buildHistoricalData({
  historicalData,
  found,
  monthFrom,
  monthTo,
  yearFrom,
  yearTo
}: {
  historicalData: Array<[string, string, string, string, string]>
  found: string
  monthFrom: number
  monthTo: number
  yearFrom: number
  yearTo: number
}) {
  const isRangeInverted =
    yearFrom > yearTo || (yearFrom === yearTo && monthFrom > monthTo)
  const normalizedDates = {
    monthFrom: isRangeInverted ? monthTo : monthFrom,
    monthTo: isRangeInverted ? monthFrom : monthTo,
    yearFrom: isRangeInverted ? yearTo : yearFrom,
    yearTo: isRangeInverted ? yearFrom : yearTo
  }
  const labels: string[] = []
  if (yearFrom === yearTo) {
    const months = [
      ...Array(normalizedDates.monthTo - normalizedDates.monthFrom + 1).keys()
    ].map((i) => normalizedDates.monthFrom + i)
    for (const month of months)
      labels.push(`${yearFrom}-${month.toString().padStart(2, '0')}`)
  } else {
    const months = [...Array(12).keys()].map((i) => 1 + i)
    const years = [
      ...Array(normalizedDates.yearTo - normalizedDates.yearFrom + 1).keys()
    ].map((i) => normalizedDates.yearFrom + i)
    years.forEach((year, index) => {
      const isFirstYear = index === 0
      const isLastYear = index === years.length - 1
      if (isFirstYear) {
        const months = [
          ...Array(12 - normalizedDates.monthFrom + 1).keys()
        ].map((i) => i + normalizedDates.monthFrom)
        for (const month of months)
          labels.push(`${year}-${month.toString().padStart(2, '0')}`)
        return
      }
      if (isLastYear) {
        const months = [...Array(normalizedDates.monthTo).keys()].map(
          (i) => i + 1
        )
        for (const month of months)
          labels.push(`${year}-${month.toString().padStart(2, '0')}`)
        return
      }
      for (const month of months)
        labels.push(`${year}-${month.toString().padStart(2, '0')}`)
    })
  }
  const preDatasets: {
    [key: string]: Array<number | null>
  } = {}
  for (const line of historicalData) {
    const [afpName, month, year, rowFound, rentability] = line
    if (rowFound !== found || !(afpName in AFPS)) continue
    preDatasets[afpName] ||= []
    const index = labels.indexOf(`${year}-${month}`)
    if (index < 0) continue
    preDatasets[afpName][index] = rentability === '\r' ? null : +rentability
  }
  const datasets: ChartDataset[] = Object.entries(preDatasets).map(
    ([label, data]) => ({
      label,
      borderColor: AFPS[label as keyof typeof AFPS].mainColor,
      backgroundColor: AFPS[label as keyof typeof AFPS].mainColor,
      data: calculateAccumulatedRentability(data),
      tension: 0.2,
      pointRadius: 0,
      pointHoverRadius: 7
    })
  )
  const date1 = yearMonthToDate(
    normalizedDates.yearFrom.toString(),
    normalizedDates.monthFrom.toString().padStart(2, '0')
  )
  const date2 = yearMonthToDate(
    normalizedDates.yearTo.toString(),
    normalizedDates.monthTo.toString().padStart(2, '0')
  )
  const fromDate = date1 < date2 ? date1 : date2
  const toDate = date1 < date2 ? date2 : date1
  const afpsOutOfPeriod: Set<string> = new Set()
  const acc: { [key: string]: Array<number> } = {}
  for (const row of historicalData) {
    const [afpName, month, year, rowFound, rentability] = row
    const date = new Date(`${year}-${month}-02`)
    if (
      date < fromDate ||
      date > toDate ||
      rowFound !== found ||
      !(afpName in AFPS) ||
      afpsOutOfPeriod.has(afpName)
    )
      continue
    if (rentability === '\r' || (!acc[afpName] && date > fromDate)) {
      afpsOutOfPeriod.add(afpName)
      continue
    }
    acc[afpName] ||= []
    acc[afpName].push(+rentability)
  }
  for (const afpName of afpsOutOfPeriod) delete acc[afpName]
  for (const afpName in AFPS) {
    if (!(afpName in acc)) afpsOutOfPeriod.add(afpName)
  }
  const tableData = Object.entries(acc)
    .map<[string, number]>(([afpName, rentabilities]) => [
      afpName,
      getRetability(rentabilities)
    ])
    .sort(([, renta1], [, renta2]) => renta2 - renta1)

  return {
    labels,
    datasets,
    tableData,
    afpsOutOfPeriod
  }
}
