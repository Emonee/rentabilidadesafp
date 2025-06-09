type ObserveAttParams<T> = {
  element: HTMLElement
  attribute: string
  callback: (value: T) => void
}

export function observeAtt<T>({
  element,
  attribute,
  callback
}: ObserveAttParams<T>) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === attribute
      ) {
        callback(JSON.parse(element.getAttribute(attribute)!))
      }
    })
  })
  observer.observe(element, { attributeFilter: [attribute] })
  return { observer }
}
