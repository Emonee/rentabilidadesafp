import { Decimal } from 'decimal.js'

export function getColor(bestValue: number, worstValue: number, actualValue: number, lessIsBetter = false, avoidWhite = false) {
  const avarageValue = (bestValue + worstValue) / 2
  if (actualValue === avarageValue) return 'white'
  const condition = lessIsBetter ? actualValue < avarageValue : actualValue > avarageValue
  const baseHsl = condition ? '120deg 100% 25%' : '0deg 100% 50%'
  const baseDiff = bestValue - avarageValue
  const actualDiff = avarageValue - actualValue
  let opacity = Math.abs(actualDiff * 100 / baseDiff)
  if (avoidWhite) opacity = (opacity + 100) / 2
  if (opacity > 100) opacity = 100
  return `hsl(${baseHsl} / ${opacity}%)`
}

// (1+r1) × (1+r2) ×…× (1+rn) − 1
export function getRetability(rentabilities: number[]) {
  let acc = new Decimal(1)
  for (const rentability of rentabilities) acc = acc.times(new Decimal(rentability).div(100).add(1))
  const rentabilityPercent = acc.minus(1).times(100)
  return rentabilityPercent.toDecimalPlaces(3).toNumber()
}
