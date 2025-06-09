export async function getHistoricalData() {
  const sessionHistoricalData = sessionStorage.getItem('historicalData')
  if (sessionHistoricalData) return JSON.parse(sessionHistoricalData)

  const response = await fetch('/data/historical_data.csv', {
    cache: 'default'
  })
  const historicalData = (await response.text()).split('\n').map((row) => {
    const [afpName, month, year, rowFound, rentability] = row.split(',')
    return [afpName, month, year, rowFound, rentability]
  })
  return historicalData as Array<[string, string, string, string, string]>
}
