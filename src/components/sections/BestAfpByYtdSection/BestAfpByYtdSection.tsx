import FoundsSelect from '@/components/forms/selects/FoundsSelect'
import BestAfpByYTDTable from '@/components/tables/BestAfpByYTDTable'
import jsonData from '@/data/ytd_12_months.json'
import type { Found } from '@/lib/utilities/types'
import { createSignal } from 'solid-js'

const afpEntries = Object.entries(jsonData)

export default function BestAfpByYtdSection() {
  const [getFound, setFound] = createSignal('A')
  const getAfpEntries = () =>
    afpEntries
      .map(([afpName, fondos]) => ({
        name: afpName,
        value: fondos[getFound() as Found].ytd
      }))
      .sort(({ value: value1 }, { value: value2 }) => value2 - value1)
  return (
    <section>
      <h2>
        Mejor AFP <span data-tooltip="Year To Date">YTD</span> por fondo:{' '}
        {getAfpEntries()[0].name}
        <a href="#last-data" style="text-decoration: none">
          *
        </a>
      </h2>
      <p>
        Corresponde al raking por rentabilidad real acumulada desde inicios del
        presente año a la actualidad.
      </p>
      <p>
        <b>Fondo a visualizar:</b>
      </p>
      <FoundsSelect selectedFound={getFound()} setSelectedFound={setFound} />
      <BestAfpByYTDTable tableRows={getAfpEntries()} />
    </section>
  )
}
