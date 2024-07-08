import { makeDestructurable } from '../shared/makeDestructurable'

export function onDevFactory(condition: boolean) {
  return <P>(cb: () => P) => condition ? cb() : undefined
}

export function toLF(content: string) {
  return content.replace(/\r\n/g, '\n')
}

/**
 * Create Setter and Getter for property without conflict (based on Symbol)
 * @example
 * // const { setMeta, getMeta } = createMeta()
 * const [s, g] = createMeta<{one: number}>()
 *
 * const obj = {}
 * s(obj, { one: 1 })
 * g(obj) // = { one: 1 }
 */
export function createMeta<T = any>(_temp?: T) {
  const metaSymbol = Symbol('createMeta')

  const set = <Target = any>(target: Target, meta: T) =>
    Object.defineProperty(target, metaSymbol, {
      value: meta,
      writable: true,
      enumerable: true,
      configurable: true,
    })

  const get = (target: any) => target?.[metaSymbol] as T | undefined

  return makeDestructurable(
    { setMeta: set, getMeta: get } as const,
    [set, get] as const,
  )
}
