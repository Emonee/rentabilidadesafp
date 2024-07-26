export function throwIfNullish<T>(value: T) {
  if (value == null) throw new TypeError()
  return value
}
