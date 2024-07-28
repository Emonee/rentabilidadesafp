import { AFPS } from '@/consts/afp'
import { HISTORICAL_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import { yearMonthToDate } from '@/lib/utilities/dates'
import { throwIfNullish } from '@/lib/utilities/helpers'
import { getRetability } from '@/lib/utilities/nums'

class BestAfpByPeriodSection extends HTMLElement {
  csvData: string | null
  table: HTMLElement
  form: HTMLFormElement
  outOfPeriodInfo: HTMLElement
  constructor() {
    super()
    this.csvData = null
    this.table = throwIfNullish(this.querySelector<HTMLElement>('best-afp-by-period-table'))
    this.form = throwIfNullish(this.querySelector<HTMLFormElement>('form'))
    this.outOfPeriodInfo = throwIfNullish(this.querySelector<HTMLElement>('out-of-period-afps'))
    this.setInitialPeriodValues()
    this.getCsvData()
      .then(() => this.renderData())
      .catch(console.error)
    this.form.addEventListener('submit', (event) => {
      event.preventDefault()
      this.renderData()
    })
  }
  async getCsvData() {
    this.csvData = await fetchResource<string>({
      cacheName: HISTORICAL_DATA.cacheName,
      route: HISTORICAL_DATA.route,
      isJson: false
    })
  }
  renderData() {
    const { afpsOutOfPeriod, data } = this.buildRankingData()
    this.outOfPeriodInfo.setAttribute('data-afps', JSON.stringify(Array.from(afpsOutOfPeriod)))
    this.table.setAttribute('data-table-rows', JSON.stringify(data))
  }
  setInitialPeriodValues() {
    const monthFromSelect = throwIfNullish(this.querySelector<HTMLSelectElement>('select[name="monthFrom"]'))
    const yearFromSelect = throwIfNullish(this.querySelector<HTMLSelectElement>('select[name="yearFrom"]'))
    const monthToSelect = throwIfNullish(this.querySelector<HTMLSelectElement>('select[name="monthTo"]'))
    const yearToSelect = throwIfNullish(this.querySelector<HTMLSelectElement>('select[name="yearTo"]'))
    const now = new Date()
    const threeYearsBefore = new Date()
    threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3)
    threeYearsBefore.setMonth(threeYearsBefore.getMonth() + 1)
    monthFromSelect.value = (threeYearsBefore.getMonth() + 1).toString().padStart(2, '0')
    yearFromSelect.value = threeYearsBefore.getFullYear().toString()
    monthToSelect.value = (now.getMonth() + 1).toString().padStart(2, '0')
    yearToSelect.value = now.getFullYear().toString()
  }
  buildRankingData() {
    if (!this.csvData) throw Error()
    const { found: selectedFound, monthFrom, yearFrom, monthTo, yearTo } = Object.fromEntries(new FormData(this.form))
    const content = this.csvData.split('\n')
    content.shift()?.split(',')
    const date1 = yearMonthToDate(yearFrom as string, monthFrom as string)
    const date2 = yearMonthToDate(yearTo as string, monthTo as string)
    const fromDate = date1 < date2 ? date1 : date2
    const toDate = date1 < date2 ? date2 : date1
    const afpsOutOfPeriod: Set<string> = new Set()
    const acc: { [key: string]: Array<number> } = {}
    for (const row of content) {
      const [afpName, month, year, found, rentability] = row.split(',')
      const date = new Date(`${year}-${month}-02`)
      if (
        date < fromDate ||
        date > toDate ||
        found !== selectedFound ||
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
    const data = Object.entries(acc)
      .map<[string, number]>(([afpName, rentabilities]) => [afpName, getRetability(rentabilities)])
      .sort(([, renta1], [, renta2]) => renta2 - renta1)
    return { data, afpsOutOfPeriod }
  }
}

customElements.define('best-afp-by-period-section', BestAfpByPeriodSection)
