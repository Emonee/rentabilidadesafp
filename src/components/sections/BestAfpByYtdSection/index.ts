import jsonData from '@/data/ytd_12_months.json'
import type { Found } from '@/lib/utilities/types'

class BestYtdAfpSection extends HTMLElement {
  constructor() {
    super()
    const fondosSelect = this.querySelector<HTMLSelectElement>('select')
    this.selectedFound = 'A'
    fondosSelect?.addEventListener('change', (event) => {
      const newFound = (event.target as HTMLSelectElement)?.value as Found
      this.selectedFound = newFound
    })
  }
  set selectedFound(newSelectedFound: Found) {
    if (!jsonData) return
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
}
customElements.define('best-ytd-afp-section', BestYtdAfpSection)
