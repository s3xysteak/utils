import { isFunction, isObject } from '@antfu/utils'

export const isArray = Array.isArray

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    (isObject(val) || isFunction(val))
    && isFunction((val as any).then)
    && isFunction((val as any).catch)
  )
}
