import BasicSimulationResultsAfps from '@/components/articles/BasicSimulationResultsAfps'
import { MONTHLY_CONTRIBUTION_PROPORTION } from '@/consts/afp'
import {
  BASIC_SIMULATION_FOUND,
  BASIC_SIMULATION_STARTING_YEAR,
  BASIC_SIMULATION_STATING_MONTH,
  BASIC_SIMULATION_YEARS,
  BASIC_SIMULATION_YEARS_OF_RETIREMENTS,
  NET_TO_GROSS_BASIC_PROPORTION
} from '@/consts/num'
import { getAvarageMonthlyReturnsByAfp } from '@/lib/utilities/data_handlers/afps'
import { getAccumulatedMoneyBySalaryAndReturns } from '@/lib/utilities/data_handlers/money_accumulation'
import { formatNumber, getRetability } from '@/lib/utilities/nums'
import type { BasicAfpSimulationResult, CsvData } from '@/lib/utilities/types'

type Props = {
  netSalary: number
  historicalData: CsvData
}

export default function (props: Props) {
  const afpsMonthAvarageReturns = getAvarageMonthlyReturnsByAfp(
    props.historicalData,
    {
      startingMonth: BASIC_SIMULATION_STATING_MONTH,
      startingYear: BASIC_SIMULATION_STARTING_YEAR
    }
  )
  const sortedAfps = Object.entries(afpsMonthAvarageReturns).sort(
    ([, return1], [, return2]) =>
      return2[BASIC_SIMULATION_FOUND] - return1[BASIC_SIMULATION_FOUND]
  )
  const getSortedAfpsWithData: () => BasicAfpSimulationResult[] = () =>
    sortedAfps.map(([afpName, foundsWithAvgReturn]) => {
      const avgReturn = foundsWithAvgReturn[BASIC_SIMULATION_FOUND]
      const returns = new Array<number>(12 * BASIC_SIMULATION_YEARS).fill(
        avgReturn
      )
      const accTotal = getAccumulatedMoneyBySalaryAndReturns({
        netSalary: props.netSalary,
        returns
      })
      const accReturn = getRetability(returns).toFixed(2)
      const estimatedPension = Math.round(
        accTotal / (12 * BASIC_SIMULATION_YEARS_OF_RETIREMENTS)
      )
      const salaryPensionProportion = (estimatedPension * 100) / props.netSalary
      return {
        afpName,
        avgReturn,
        accReturn,
        accTotal,
        estimatedPension,
        salaryPensionProportion
      }
    })
  const getAccumulated = () =>
    Math.round(
      props.netSalary *
        NET_TO_GROSS_BASIC_PROPORTION *
        MONTHLY_CONTRIBUTION_PROPORTION *
        12 *
        BASIC_SIMULATION_YEARS
    )
  return (
    <section>
      <h4>En un periodo de {BASIC_SIMULATION_YEARS} años:</h4>
      <p>Aportaste un total de: ${formatNumber(getAccumulated())}</p>
      <BasicSimulationResultsAfps afps={getSortedAfpsWithData()} />
    </section>
  )
}
