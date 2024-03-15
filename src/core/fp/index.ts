import { isArray } from '../is'

export type LastReturnType<T extends any[]> =
    T extends [...infer _, infer L] ?
      L extends (...args: any) => infer R ? R : never : never

export function flow<T extends ((...args: any[]) => any)[]>(...funcs: T) {
  return (...args: Parameters<T[0]>): LastReturnType<T> =>
    (
      funcs.reduce((acc, func) =>
        isArray(acc)
          ? func(...acc)
          : func(acc), args)
    ) as LastReturnType<T>
}
