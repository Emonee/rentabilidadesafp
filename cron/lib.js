import { writeFile } from 'node:fs/promises'
import { superintendenciaUrl } from './consts.js'

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

export async function fetchSuperintendencia({ year, month }) {
  const searchParams = new URLSearchParams({
    tiprent: 'FP',
    template: '0'
  })
  const urlWithParams = `${superintendenciaUrl}?${searchParams.toString()}`
  const formData = new URLSearchParams({
    aaaa: year,
    mm: month,
    btn: 'Buscar'
  })
  return await fetch(urlWithParams, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
}
