import { getColor } from '@/lib/utilities/nums'

class BestAfpByPeriodTable extends HTMLElement {
  static observedAttributes = ['data-table-rows']
  attributeChangedCallback(attName: string, _oldValue: string, newValue: string) {
    if (attName !== 'data-table-rows') return
    const newRows = JSON.parse(newValue)
    const fragment = document.createDocumentFragment()
    for (const [name, value] of newRows) {
      const tableRow = document.createElement('tr')
      const tableNameData = document.createElement('td')
      const tableValueData = document.createElement('td')
      tableNameData.textContent = name
      tableValueData.textContent = `${value.toString().padEnd(4, '0')} %`
      const color = getColor(100, -100, value, false, true)
      tableNameData.style.setProperty('border-left', `4px solid ${color}`)
      tableValueData.style.setProperty('text-align', 'center')
      tableValueData.style.setProperty('border-right', `4px solid ${color}`)
      tableValueData.style.setProperty('border-left', `4px solid ${color}`)
      tableRow.appendChild(tableNameData)
      tableRow.appendChild(tableValueData)
      fragment.appendChild(tableRow)
    }
    const tBody = this.querySelector('table tbody')
    tBody?.replaceChildren(fragment)
  }
}

customElements.define('best-afp-by-period-table', BestAfpByPeriodTable)
