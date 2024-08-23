import { MONTHLY_CONTRIBUTION_PROPORTION } from '@/consts/afp'
import { NET_TO_GROSS_BASIC_PROPORTION } from '@/consts/num'
import Decimal from 'decimal.js'

export function getAccumulatedMoneyBySalaryAndReturns({
  netSalary,
  grossSalary,
  returns
}: {
  netSalary?: number
  grossSalary?: number
  returns: number[]
}) {
  const salary = grossSalary ?? netSalary! * NET_TO_GROSS_BASIC_PROPORTION
  const savingAmountFromSalary = new Decimal(salary).times(
    new Decimal(MONTHLY_CONTRIBUTION_PROPORTION)
  )
  const accumulatedMoney = returns.reduce((acc, curr) => {
    const modifyer = new Decimal(curr)
      .div(new Decimal(100))
      .plus(new Decimal(1))
    const rentability = acc.times(modifyer)
    return rentability.plus(savingAmountFromSalary)
  }, new Decimal(0))
  return accumulatedMoney.round().toNumber()
}
