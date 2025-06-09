import type { Found } from '@/lib/utilities/types'

export const AFPS = {
  UNO: {
    mainColor: '#D33485BB',
    secondaryColor: '#D3348555',
    fullOpacityColor: '#D33485',
    comition: 0.49
  },
  MODELO: {
    mainColor: '#82BD01BB',
    secondaryColor: '#82BD0155',
    fullOpacityColor: '#82BD01',
    comition: 0.58
  },
  PLANVITAL: {
    mainColor: '#C21B17BB',
    secondaryColor: '#C21B1755',
    fullOpacityColor: '#C21B17',
    comition: 1.16
  },
  HABITAT: {
    mainColor: '#9966FFBB',
    secondaryColor: '#9966FF55',
    fullOpacityColor: '#9966FF',
    comition: 1.27
  },
  CAPITAL: {
    mainColor: '#4BC0C0BB',
    secondaryColor: '#4BC0C055',
    fullOpacityColor: '#4BC0C0',
    comition: 1.44
  },
  CUPRUM: {
    mainColor: '#EBA932BB',
    secondaryColor: '#EBA93255',
    fullOpacityColor: '#EBA932',
    comition: 1.44
  },
  PROVIDA: {
    mainColor: '#0061A0BB',
    secondaryColor: '#0061A055',
    fullOpacityColor: '#0061A0',
    comition: 1.45
  }
}
export const FONDOS: { name: Found; description: string }[] = [
  { name: 'A', description: 'Muy riesgoso' },
  { name: 'B', description: 'Riesgoso' },
  { name: 'C', description: 'Moderado' },
  { name: 'D', description: 'Conservador' },
  { name: 'E', description: 'Muy conservador' }
]

export const MONTHLY_CONTRIBUTION_PROPORTION = 0.1
