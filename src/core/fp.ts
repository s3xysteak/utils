import { isArray } from './is'

export type LastReturnType<T extends any[]> =
    T extends [...infer _, infer L] ?
      L extends (...args: any) => infer R ? R : never : never

/**
 * Compose functions from left to right, with **AWESOME** type intelligent.
 *
 * @example
 * ```js
 * const add = (a, b) => a + b
 * const square = n => n * n
 *
 * const val = flow(add, square)
 * val(1, 2) // 9
 * ```
 */
export function flow<T extends ((...args: any[]) => any)[]>(...funcs: T) {
  return (...args: Parameters<T[0]>): LastReturnType<T> =>
    (
      funcs.reduce((acc, func) =>
        isArray(acc)
          ? func(...acc)
          : func(acc), args)
    ) as LastReturnType<T>
}
