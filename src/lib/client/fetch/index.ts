import { CACHE_HEADER_NAME, HISTORICAL_DATA_FILE_ROUTE } from '@/consts/data'
import { getHistoricalDataCache } from '@/lib/client/cache'

export async function getHistoricalDataCsvString () {
  const { cache, cacheResponse } = await getHistoricalDataCache()
  if (!cacheResponse) {
    const res = await fetch(HISTORICAL_DATA_FILE_ROUTE.route)
    const headers = new Headers(res.headers)
    headers.append(CACHE_HEADER_NAME, Date.now().toString())
    const clonedResponse = new Response(res.clone().body, {
      status: res.status,
      statusText: res.statusText,
      headers
    })
    cache
      .put(HISTORICAL_DATA_FILE_ROUTE.route, clonedResponse)
      .catch(() => {})
    const text = await res.text()
    return text
  }
  const text = await cacheResponse.text()
  return text
}
