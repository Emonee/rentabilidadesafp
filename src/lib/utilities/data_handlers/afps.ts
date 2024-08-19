import { AFPS } from '@/consts/afp'
import type { CsvData } from '@/lib/utilities/types'
import Decimal from 'decimal.js'
import { getAvarageFromArray } from '../nums'

export function getAvarageMonthlyReturnsByAfp(historicalData: CsvData) {
  const afps: { [afpName: string]: { [found: string]: number[] } } = {}
  for (const [afpName, , , found, rentability] of historicalData) {
    if (!(afpName in AFPS) || rentability == '\r' || isNaN(+rentability))
      continue
    afps[afpName] ||= {}
    afps[afpName][found] ||= []
    afps[afpName][found].push(+rentability)
  }
  const afpsWithAvarageMonthlyReturn: {
    [afpName: string]: { [found: string]: number }
  } = {}
  for (const afpName in afps) {
    for (const found in afps[afpName]) {
      const monthlyReturns = afps[afpName][found]
      const avarage = getAvarageFromArray(monthlyReturns)
      afpsWithAvarageMonthlyReturn[afpName] ||= {}
      afpsWithAvarageMonthlyReturn[afpName][found] = avarage
    }
  }
  return afpsWithAvarageMonthlyReturn
}

export function afpComitionOnSalary({
  afpName,
  salary
}: {
  afpName: keyof typeof AFPS
  salary: number
}) {
  const { comition } = AFPS[afpName]
  return new Decimal(salary).times(new Decimal(comition)).round().toNumber()
}
