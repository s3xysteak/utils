export const isArray = Array.isArray

export function isPromise(val: unknown): val is Promise<unknown> {
  return Object.prototype.toString.call(val) === '[object Promise]'
}
