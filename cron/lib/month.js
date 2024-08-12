export class MonthDataSaver {
  constructor() {
    this.stringDataForCsv = ''
    this.jsonDataForYtd = {}
  }
  saveData({ afpName, month, year, found, monthRentability, ytd, acc }) {
    this.stringDataForCsv += `${afpName},${month},${year},${found},${monthRentability}\n`
    this.jsonDataForYtd[afpName] ||= {}
    this.jsonDataForYtd[afpName][found] ||= {}
    this.jsonDataForYtd[afpName][found].month = monthRentability
    this.jsonDataForYtd[afpName][found].ytd = ytd
    this.jsonDataForYtd[afpName][found].acc = acc
  }
}
