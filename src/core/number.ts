export function toNumber(raw: string | number) {
  const maybeNum = Number(raw)
  return Number.isNaN(maybeNum) ? undefined : maybeNum
}

export const isInRange = (val: number, [min, max]: [number, number]) => val >= min && val <= max
