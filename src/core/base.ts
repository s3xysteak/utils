import { makeDestructurable } from '../shared/makeDestructurable'

export function onDevFactory(condition: boolean) {
  return <P>(cb: () => P) => condition ? cb() : undefined
}

export function toLF(content: string) {
  return content.replace(/\r\n/g, '\n')
}

export function createMeta<T = any>(_temp?: T) {
  const metaSymbol = Symbol('createMeta')

  const set = <Target = any>(target: Target, meta: T) => {
    // @ts-expect-error - object index type error
    target[metaSymbol] = meta
    return target
  }

  const get = (target: any) => target[metaSymbol] as T | undefined

  return makeDestructurable(
    { setMeta: set, getMeta: get } as const,
    [set, get] as const,
  )
}
