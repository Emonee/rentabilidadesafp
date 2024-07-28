import { TIMESTAMP_CACHE_HEADER_NAME } from '@/consts/data'
import { getCacheWithResponse } from '@/lib/client/cache'

export async function fetchResource<T>({
  cacheName,
  route,
  isJson = true
}: { cacheName: string; route: string; isJson?: boolean }): Promise<T> {
  const { cache, cacheResponse } = await getCacheWithResponse({
    cacheName,
    route
  })
  if (cacheResponse) {
    const resource = isJson ? await cacheResponse.json() : cacheResponse.text()
    return resource
  }
  const res = await fetch(route)
  storeResponseInCacheWithTimestamp({ res, cache, route })
  const resource = isJson ? await res.json() : res.text()
  return resource
}

function storeResponseInCacheWithTimestamp({ res, cache, route }: { res: Response; cache: Cache; route: string }) {
  const headers = new Headers(res.headers)
  headers.append(TIMESTAMP_CACHE_HEADER_NAME, Date.now().toString())
  const clonedResponse = new Response(res.clone().body, {
    status: res.status,
    statusText: res.statusText,
    headers
  })
  cache.put(route, clonedResponse).catch(console.error)
}
