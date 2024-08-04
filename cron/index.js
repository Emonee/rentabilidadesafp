import * as cheerio from 'cheerio'
import { execSync } from 'node:child_process'
import { appendFile, writeFile } from 'node:fs/promises'

const HISTORICAL_DATA_FILE_ROUTE = './public/data/historical_data.csv'
const YTD_12_MONTHS_FILE_ROUTE = './public/data/ytd_12_months.json'

const now = new Date()
const month = now.getMonth().toString().padStart(2, '0')
const year = now.getFullYear().toString()
const founds = ['A', 'B', 'C', 'D', 'E']
const validAfps = [
  'CAPITAL',
  'CUPRUM',
  'HABITAT',
  'MODELO',
  'PLANVITAL',
  'PROVIDA',
  'UNO'
]
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
  console.log('Invalid res:')
  console.log(res.statusText)
  process.exit(1)
}
const htmlString = await res.text()
const jsonData = {}
let stringData = ''
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
    jsonData[afpName] ||= {}
    jsonData[afpName][found] ||= {}

    let monthRentability = null
    let ytd = null
    let acc = null

    try {
      monthRentability = Number.parseFloat(
        $(tds[1]).text().replace('%', '').replace(',', '.')
      )
    } catch (e) {}

    try {
      ytd = Number.parseFloat(
        $(tds[2]).text().replace('%', '').replace(',', '.')
      )
    } catch (e) {}

    try {
      acc = Number.parseFloat(
        $(tds[3]).text().replace('%', '').replace(',', '.')
      )
    } catch (e) {}

    const invalidData = [monthRentability, ytd, acc].some(
      (val) => val == null || Number.isNaN(val)
    )
    if (invalidData) {
      console.log('Invalid data:')
      console.log({ invalidData })
      process.exit(1)
    }

    stringData += `${afpName},${month},${year},${found},${monthRentability}\n`
    jsonData[afpName][found].month = monthRentability
    jsonData[afpName][found].ytd = ytd
    jsonData[afpName][found].acc = acc
  })
})
try {
  console.log('Modifying files')
  await Promise.all([
    appendFile(HISTORICAL_DATA_FILE_ROUTE, stringData),
    writeFile(
      YTD_12_MONTHS_FILE_ROUTE,
      `${JSON.stringify(jsonData, undefined, 2)}\n`
    )
  ])
  execSync('git add .')
  console.log('Commiting files')
  const commitRes = execSync(
    `git commit -m "update: main data files ${year}-${month} [github-action]"`
  )
  console.log(commitRes.toString())
  console.log('Pushing changes')
  const pushRes = execSync('git push')
  console.log(pushRes.toString())
} catch (error) {
  console.error(error)
  process.exit(1)
}
