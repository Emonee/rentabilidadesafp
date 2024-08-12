import { founds, validAfps } from './lib/consts.js'
import {
  fetchSuperintendencia,
  getTablesFromHtml,
  parseReturn,
  saveAndCommitChanges
} from './lib/helpers.js'
import { MonthDataSaver } from './lib/month.js'
import { YearDataSaver } from './lib/year.js'

const yearDataSaver = new YearDataSaver()
const monthDataSaver = new MonthDataSaver()

const now = new Date()
const month = now.getMonth().toString().padStart(2, '0')
const year = now.getFullYear().toString()

const isJanuary = month === '01'

const htmlString = await fetchSuperintendencia({ year, month }).catch((e) => {
  console.error(e)
  process.exit(1)
})
const { tables, $ } = getTablesFromHtml(htmlString)

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

saveAndCommitChanges({ monthDataSaver, yearDataSaver, isJanuary })
