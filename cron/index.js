import * as cheerio from 'cheerio'
import { execSync } from 'node:child_process'
import { appendFile, writeFile } from 'node:fs/promises'
import { founds, validAfps } from './consts.js'
import { parseReturn, setLastUpdate } from './lib.js'
import { MonthDataSaver } from './month.js'
import { YearDataSaver } from './year.js'

const HISTORICAL_DATA_FILE_ROUTE = './src/data/historical_data.csv'
const YTD_12_MONTHS_FILE_ROUTE = './src/data/ytd_12_months.json'
const ANNUAL_RETURNS_FILE_ROUTE = './src/data/anual_returns.json'

const yearDataSaver = new YearDataSaver()
const monthDataSaver = new MonthDataSaver()
const now = new Date()
const month = now.getMonth().toString().padStart(2, '0')
const isJanuary = month === '01'
const year = now.getFullYear().toString()
const url = 'https://www.spensiones.cl/apps/rentabilidad/getRentabilidad.php'
const searchParams = new URLSearchParams({
  tiprent: 'FP',
  template: '0'
})
const urlWithParams = `${url}?${searchParams.toString()}`
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
if (!res.ok) {
  console.error('Invalid res: ', res.statusText)
  process.exit(1)
}
const htmlString = await res.text()
const $ = cheerio.load(htmlString)
const tables = $(
  'table.table.table-striped.table-hover.table-bordered.table-condensed'
)

if (tables.length === 0) {
  console.error('No tables found on the page.')
  process.exit(1)
}

tables.slice(1).each((index, table) => {
  const found = founds[index]
  const trs = $(table).find('tr')
  trs.slice(4).each((_, tr) => {
    const tds = $(tr).find('td')
    const afpName = $(tds[0]).text()
    if (!validAfps.includes(afpName)) return
    const monthRentability = parseReturn($(tds[1]).text())
    const ytd = parseReturn($(tds[2]).text())
    const acc = parseReturn($(tds[3]).text())
    if (isJanuary)
      yearDataSaver.registerData({
        afpName,
        year: +year - 1,
        found,
        profitability: acc
      })
    monthDataSaver.saveData({
      afpName,
      month,
      year,
      found,
      acc,
      monthRentability,
      ytd
    })
  })
})

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
