import { type ObjectKeys, isString, isUndefined } from '..'

export function groupBy<T extends any[]>(arr: T, getKey: string | ((element: T[number], index: number) => ObjectKeys)) {
  const val: Record<ObjectKeys, T[number]> = {}

  for (const [index, item] of arr.entries()) {
    const key = isString(getKey) ? item[getKey] : getKey(item, index)
    isUndefined(val[key]) ? (val[key] = [item]) : val[key].push(item)
  }

  return val
}
