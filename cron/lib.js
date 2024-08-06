export function parseReturn(returnString) {
  try {
    return Number.parseFloat(returnString.replace('%', '').replace(',', '.'))
  } catch (error) {
    throw new Error(`Invalid string: ${returnString}`)
  }
}
