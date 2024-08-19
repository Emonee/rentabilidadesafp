import { MONTHLY_CONTRIBUTION_PROPORTION } from '@/consts/afp'
import {
  BASIC_SIMULATION_YEARS,
  BASIC_SIMULATION_YEARS_OF_RETIREMENTS,
  NET_TO_GROSS_BASIC_PROPORTION
} from '@/consts/num'
import { getAvarageMonthlyReturnsByAfp } from '@/lib/utilities/data_handlers/afps'
import { getAccumulatedMoneyBySalaryAndReturns } from '@/lib/utilities/data_handlers/money_accumulation'
import { formatNumber, getRetability } from '@/lib/utilities/nums'
import type { CsvData } from '@/lib/utilities/types'

type Props = {
  netSalary: number
  historicalData: CsvData
}

export default function (props: Props) {
  const afpsMonthAvarageReturns = getAvarageMonthlyReturnsByAfp(
    props.historicalData
  )
  const modeloA = afpsMonthAvarageReturns.MODELO.A
  const returns = new Array<number>(12 * BASIC_SIMULATION_YEARS).fill(modeloA)
  const getTotal = () =>
    getAccumulatedMoneyBySalaryAndReturns({
      netSalary: props.netSalary,
      returns
    })
  const accumulated = Math.round(
    props.netSalary *
      NET_TO_GROSS_BASIC_PROPORTION *
      MONTHLY_CONTRIBUTION_PROPORTION *
      12 *
      BASIC_SIMULATION_YEARS
  )
  const accRentability = getRetability(returns).toFixed(2)
  const guidePension = Math.round(
    getTotal() / (12 * BASIC_SIMULATION_YEARS_OF_RETIREMENTS)
  )
  return (
    <>
      <h4>En un periodo de {BASIC_SIMULATION_YEARS} años:</h4>
      <p>Con un sueldo líquido de ${formatNumber(props.netSalary)}</p>
      <p>Aportaste un total de: ${formatNumber(accumulated)}</p>
      <p>Hubo una rentabilidad real acumulada de: {accRentability}%</p>
      <p>Eso deja un total acumulado de: ${formatNumber(getTotal())}</p>
      <p>Pensión mensual guía: ${formatNumber(guidePension)}</p>
    </>
  )
}
