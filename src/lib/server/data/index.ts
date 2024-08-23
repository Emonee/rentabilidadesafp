import type { CsvData } from '@/lib/utilities/types'
import { readFile } from 'node:fs/promises'

let csvData: CsvData

export async function getHistoricalData(): Promise<CsvData> {
  if (csvData) return csvData
  const isDev = import.meta.env.MODE === 'development'
  const filePath = isDev
    ? new URL('../../../data/historical_data.csv', import.meta.url)
    : new URL('../data/historical_data.csv', import.meta.url)
  const csvString = await readFile(filePath, { encoding: 'utf-8' })
  csvData = csvString.split('\n').map((row) => {
    const [afpName, month, year, rowFound, rentability] = row.split(',')
    return [afpName, month, year, rowFound, rentability]
  })
  return csvData
}

export async function getLastUpdateDate(): Promise<Date> {
  const isDev = import.meta.env.MODE === 'development'
  const filePath = isDev
    ? new URL('../../../data/last_updated.txt', import.meta.url)
    : new URL('../data/last_updated.txt', import.meta.url)
  const lastUpdateString = await readFile(filePath, { encoding: 'utf-8' })
  return new Date(lastUpdateString)
}
