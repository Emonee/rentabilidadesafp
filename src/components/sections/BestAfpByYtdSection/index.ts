import jsonData from '@/json_data/ytd_acc.json'
import type { Found } from '@/lib/utilities/types'

class BestYtdAfpSection extends HTMLElement {
  _selectedFound: string
  constructor() {
    super()
    const fondosSelect = this.querySelector<HTMLSelectElement>('select')
    this._selectedFound = ''
    this.selectedFound = fondosSelect?.value as Found
    fondosSelect?.addEventListener('change', (event) => {
      const newFound = (event.target as HTMLSelectElement)?.value as Found
      this.selectedFound = newFound
    })
  }

  set selectedFound(newSelectedFound: Found) {
    this._selectedFound = newSelectedFound
    const bestAfpSpan = this.querySelector<HTMLSpanElement>(
      'span[data-best-afp-by-ytd-span]'
    )
    const bestAfpByYtdTable = this.querySelector<HTMLElement>(
      'best-afp-by-ytd-table'
    )
    const afpEntries = Object.entries(jsonData)
    const afpSortedByFondo = afpEntries
      .map(([afpName, fondos]) => ({
        name: afpName,
        value: fondos[newSelectedFound].ytd
      }))
      .sort(({ value: value1 }, { value: value2 }) => value2 - value1)
    if (bestAfpSpan) bestAfpSpan.textContent = afpSortedByFondo[0].name
    bestAfpByYtdTable?.setAttribute(
      'data-table-rows',
      JSON.stringify(afpSortedByFondo)
    )
  }

  get selectedFound() {
    return this._selectedFound as Found
  }
}
customElements.define('best-ytd-afp-section', BestYtdAfpSection)
