import { toString } from '@antfu/utils'

export const isArray = Array.isArray

export function isPromise(val: unknown): val is Promise<unknown> {
  return toString(val) === '[object Promise]'
}
