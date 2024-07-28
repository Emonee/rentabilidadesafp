import { PUBLIC_YTD_ACC_DATA } from '@/consts/data'
import { fetchResource } from '@/lib/client/fetch'
import type { Found, FundSystemData } from '@/lib/utilities/types'

class BestYtdAfpSection extends HTMLElement {
  _selectedFound: string
  jsonData?: FundSystemData
  constructor() {
    super()
    fetchResource<FundSystemData>({ cacheName: PUBLIC_YTD_ACC_DATA.cacheName, route: PUBLIC_YTD_ACC_DATA.route }).then(
      (res) => {
        this.jsonData = res
        this.selectedFound = fondosSelect?.value as Found
      }
    )
    const fondosSelect = this.querySelector<HTMLSelectElement>('select')
    this._selectedFound = ''
    fondosSelect?.addEventListener('change', (event) => {
      const newFound = (event.target as HTMLSelectElement)?.value as Found
      this.selectedFound = newFound
    })
  }
  set selectedFound(newSelectedFound: Found) {
    if (!this.jsonData) return
    this._selectedFound = newSelectedFound
    const bestAfpSpan = this.querySelector<HTMLSpanElement>('span[data-best-afp-by-ytd-span]')
    const bestAfpByYtdTable = this.querySelector<HTMLElement>('best-afp-by-ytd-table')
    const afpEntries = Object.entries(this.jsonData)
    const afpSortedByFondo = afpEntries
      .map(([afpName, fondos]) => ({
        name: afpName,
        value: fondos[newSelectedFound].ytd
      }))
      .sort(({ value: value1 }, { value: value2 }) => value2 - value1)
    if (bestAfpSpan) bestAfpSpan.textContent = afpSortedByFondo[0].name
    bestAfpByYtdTable?.setAttribute('data-table-rows', JSON.stringify(afpSortedByFondo))
  }
  get selectedFound() {
    return this._selectedFound as Found
  }
}
customElements.define('best-ytd-afp-section', BestYtdAfpSection)
