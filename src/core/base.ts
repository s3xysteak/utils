import { makeDestructurable } from '../shared/makeDestructurable'

export function onDevFactory(condition: boolean) {
  return <P>(cb: () => P) => condition ? cb() : undefined
}

export function toLF(content: string) {
  return content.replace(/\r\n/g, '\n')
}

export function createMeta<T = any>(_temp?: T) {
  const metaSymbol = Symbol('createMeta')

  const set = (target: any, meta: T) =>
    Object.defineProperty(target, metaSymbol, {
      value: meta,
      writable: true,
      enumerable: true,
      configurable: true,
    })

  const get = (target: any) => target[metaSymbol] as T

  return makeDestructurable(
    { setMeta: set, getMeta: get } as const,
    [set, get] as const,
  )
}
