const isString = (val: unknown): val is string => typeof val === 'string'
const isUndefined = (val: any): val is undefined => Object.prototype.toString.call(val) === '[object Undefined]'

/**
 * Classification by specified method
 *
 * @example
 * expect(
 *   groupBy([
 *     { type: 'apple', size: 2 },
 *     { type: 'banana', size: 3 },
 *     { type: 'pear', size: 2 },
 *     { type: 'mango', size: 1 },
 *     { type: 'apple', size: 4 },
 *     { type: 'banana', size: 6 },
 *     { type: 'pear', size: 6, special: true },
 *   ], 'type') // or use `item => item.type` instead of `'type'`
 * ).toEqual({
 *   apple: [
 *     { type: 'apple', size: 2 },
 *     { type: 'apple', size: 4 },
 *   ],
 *   banana: [
 *     { type: 'banana', size: 3 },
 *     { type: 'banana', size: 6 },
 *   ],
 *   pear: [
 *     { type: 'pear', size: 2 },
 *     { type: 'pear', size: 6, special: true },
 *   ],
 *   mango: [
 *     { type: 'mango', size: 1 },
 *   ],
 * })
 */
export function groupBy<T extends any[]>(arr: T, getKey: string | ((element: T[number], index: number) => PropertyKey)) {
  const val: Record<PropertyKey, T[number]> = {}

  for (const [index, item] of arr.entries()) {
    const key = isString(getKey) ? item[getKey] : getKey(item, index)
    if (isUndefined(val[key]))
      (val[key] = [item])
    else
      val[key].push(item)
  }

  return val
}
