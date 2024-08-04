import { readFile } from 'node:fs/promises'

type CsvData = Array<[string, string, string, string, string]>

let csvData: CsvData

export async function getHistoricalData(): Promise<CsvData> {
  if (csvData) return csvData
  const filePath = new URL('../../../data/historical_data.csv', import.meta.url)
  const csvString = await readFile(filePath)
  csvData = csvString
    .toString()
    .split('\n')
    .map((row) => {
      const [afpName, month, year, rowFound, rentability] = row.split(',')
      return [afpName, month, year, rowFound, rentability]
    })
  return csvData
}
