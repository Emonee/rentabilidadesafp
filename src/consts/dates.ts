export const MONTHS: { [num: number]: string | undefined } = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
}

export const YEARS = Array.from(
  { length: new Date().getFullYear() - 2005 + 1 },
  (_, i) => 2005 + i
)
