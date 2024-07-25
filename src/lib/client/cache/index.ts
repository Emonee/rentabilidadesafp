import {
  CACHE_HEADER_NAME,
  HISTORICAL_DATA_FILE_ROUTE,
  HISTORICAL_DATE_CACHE_NAME,
  UPDATE_HISTORICAL_DATA_DAY
} from '@/consts/data'

export async function getHistoricalDataCache () {
  const cache = await caches.open(HISTORICAL_DATE_CACHE_NAME)
  const cacheResponse = await cache.match(HISTORICAL_DATA_FILE_ROUTE.route)
  const cacheTimeStamp = cacheResponse?.headers.get(CACHE_HEADER_NAME)
  if (!cacheResponse || !cacheTimeStamp) {
    return {
      cache,
      cacheResponse
    }
  }
  const cacheDate = new Date(Number(cacheTimeStamp))
  const lastUpdate = getLastUpdateFromText(await cacheResponse.clone().text())
  const cacheIsOld = lastUpdate > cacheDate
  return {
    cache,
    cacheResponse: cacheIsOld ? undefined : cacheResponse
  }
}

function getLastUpdateFromText (csvString: string): Date {
  const lastLine = csvString.split('\n').at(-2)
  if (!lastLine) return new Date()
  const [, month, year] = lastLine.split(',')
  return new Date(`${year}-${month}-${UPDATE_HISTORICAL_DATA_DAY}T00:00:00`)
}
