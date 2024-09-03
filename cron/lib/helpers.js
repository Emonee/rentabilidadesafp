import * as cheerio from 'cheerio'
import { execSync } from 'node:child_process'
import { appendFile, writeFile } from 'node:fs/promises'
import {
  ANNUAL_RETURNS_FILE_ROUTE,
  HISTORICAL_DATA_FILE_ROUTE,
  superintendenciaUrl,
  YTD_12_MONTHS_FILE_ROUTE
} from './consts.js'

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
  const res = await fetch(urlWithParams, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
  if (!res.ok) throw new Error(`Bad response: ${res.status}, ${res.statusText}`)
  return await res.text()
}

export function getTablesFromHtml(htmlString) {
  const $ = cheerio.load(htmlString)
  const tables = $(
    'table.table.table-striped.table-hover.table-bordered.table-condensed'
  )
  if (tables.length === 0) {
    console.error('No tables found on the page.')
    process.exit(1)
  }
  return { tables, $ }
}

export async function saveAndCommitChanges({
  yearDataSaver,
  monthDataSaver,
  isJanuary,
  year,
  month
}) {
  try {
    console.info('Modifying files')
    if (isJanuary)
      await writeFile(ANNUAL_RETURNS_FILE_ROUTE, yearDataSaver.annualData)
    await Promise.all([
      appendFile(HISTORICAL_DATA_FILE_ROUTE, monthDataSaver.stringDataForCsv),
      writeFile(
        YTD_12_MONTHS_FILE_ROUTE,
        `${JSON.stringify(monthDataSaver.jsonDataForYtd, undefined, 2)}\n`
      ),
      setLastUpdate()
    ])
    execSync('git add .')
    console.info('Commiting files')
    const commitRes = execSync(
      `git commit -m "update: main data files ${year}-${month} [github-action]"`
    )
    console.info(commitRes.toString())
    console.info('Pushing changes')
    const pushRes = execSync('git push')
    console.info(pushRes.toString())
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
