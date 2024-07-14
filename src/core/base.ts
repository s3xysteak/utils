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
 * // const { set, get } = createMeta()
 * const [s, g] = createMeta<{one: number}>()
 *
 * const obj = {}
 * s(obj, { one: 1 })
 * g(obj) // = { one: 1 }
 */
export function createMeta<T = any>(metaSymbol: PropertyKey = Symbol('createMeta'), _temp?: T) {
  const set = <Meta = T, Target = any>(target: Target, meta: Meta) =>
    Object.defineProperty(target, metaSymbol, {
      value: meta,
      writable: true,
      enumerable: true,
      configurable: true,
    })

  const get = <Meta = T>(target: any) => target?.[metaSymbol] as Meta | undefined

  return makeDestructurable(
    { set, get } as const,
    [set, get] as const,
  )
}
