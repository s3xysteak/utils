import { isString, isUndefined } from '..'

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
