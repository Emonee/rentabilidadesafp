import { TIMESTAMP_CACHE_HEADER_NAME, UPDATE_HISTORICAL_DATA_DAY } from '@/consts/data'

export async function getCacheWithResponse({ cacheName, route }: { cacheName: string; route: string }) {
  const cache = await caches.open(cacheName)
  const cacheResponse = await cache.match(route)
  const cacheTimeStamp = cacheResponse?.headers.get(TIMESTAMP_CACHE_HEADER_NAME)
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

function getLastUpdateFromText(csvString: string): Date {
  const lastLine = csvString.split('\n').at(-2)
  if (!lastLine) return new Date()
  const [, month, year] = lastLine.split(',')
  return new Date(`${year}-${month}-${UPDATE_HISTORICAL_DATA_DAY}T00:00:00`)
}
