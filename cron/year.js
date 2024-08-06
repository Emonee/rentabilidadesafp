import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const annualJson = require('../src/data/anual_returns.json')

export class YearDataSaver {
  constructor() {
    this._annualData = annualJson
  }
  registerData({ afpName, year, found, profitability }) {
    this._annualData[afpName] ||= {}
    this._annualData[afpName][year] ||= {}
    this._annualData[afpName][year][found] = profitability
  }
  get annualData() {
    return `${JSON.stringify(this._annualData, null, 2)}\n`
  }
  set annualData(data) {
    this._annualData = data
  }
}
