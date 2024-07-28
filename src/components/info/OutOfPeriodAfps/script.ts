class OutOfPeriodAfps extends HTMLElement {
  static observedAttributes = ['data-afps']
  attributeChangedCallback(_attName: string, _oldValue: string, newValue: string) {
    const ul = this.querySelector('ul')
    if (!ul || !newValue) return this.changeDisplay('none')
    const afps = JSON.parse(newValue) as string[]
    if (!afps.length) return this.changeDisplay('none')
    const fragment = document.createDocumentFragment()
    for (const afp of afps) {
      const li = document.createElement('li')
      li.textContent = afp
      fragment.appendChild(li)
    }
    ul?.replaceChildren(fragment)
    this.changeDisplay('block')
  }
  changeDisplay(property: string) {
    this.style.setProperty('display', property)
  }
}

customElements.define('out-of-period-afps', OutOfPeriodAfps)
