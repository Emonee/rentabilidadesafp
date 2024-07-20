import { HISTORICAL_DATA_FILE_ROUTE } from "@/consts/data";

export async function getHistoricalDataCsvString() {
  try {
    const res = await fetch(HISTORICAL_DATA_FILE_ROUTE.route)
    const text = await res.text( )
    return text
  } catch (error) {
    return ''
  }
}
