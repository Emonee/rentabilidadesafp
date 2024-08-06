import { writeFile } from 'node:fs/promises'

export function parseReturn(returnString) {
  try {
    return Number.parseFloat(returnString.replace('%', '').replace(',', '.'))
  } catch (error) {
    throw new Error(`Invalid string: ${returnString}`)
  }
}

export async function setLastUpdate() {
  const lastUpdateRoute = './src/data/last_updated.txt'
  const now = new Date()
  writeFile(lastUpdateRoute, now.toISOString())
}
