export function toNumber(raw: string | number) {
  const maybeNum = Number(raw)
  return Number.isNaN(maybeNum) ? undefined : maybeNum
}

export const isInRange = (val: number, [min, max]: [number, number]) => val >= min && val <= max

/**
 * Closed interval random number
 * @example
 * randomInt(1, 10) // 1 <= x <= 10
 * randomInt(1, 10, () => myRand()) // to replace `Math.random`
 */
export function randomInt(min: number, max: number, rand = () => Math.random()): number {
  const low = Math.ceil(min)
  const high = Math.floor(max)
  return Math.floor(rand() * (high - low + 1)) + low
}
