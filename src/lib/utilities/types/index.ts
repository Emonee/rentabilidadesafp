export type Found = 'A' | 'B' | 'C' | 'D' | 'E'
export type FoundsAnnualReturns = {
  [found in Found]: number | null
}
export type YearData = {
  [key: string]: FoundsAnnualReturns
}
export type AnualReturns = {
  [key: string]: YearData
}
export type FundData = {
  ytd: number
  acc: number
}
export type FundCompanyData = {
  [found in Found]: FundData
}
export type FundSystemData = {
  [company: string]: FundCompanyData
}
