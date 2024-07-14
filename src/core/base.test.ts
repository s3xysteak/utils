import { describe, expect, expectTypeOf, it } from 'vitest'
import { noop } from '@antfu/utils'
import { createMeta, toLF } from './base'

describe('base', () => {
  it('toLF', () => {
    const crlf = 'hello\r\nworld'
    const lf = 'hello\nworld'
    expect(toLF(crlf)).toBe(lf)
  })
})

describe('base:createMeta', () => {
  it('basic', () => {
    const obj = { one: 1 }

    const [s, g] = createMeta()

    s(obj, { two: 2 })
    expect(g(obj)).toEqual({ two: 2 })

    const returnsOfSetter = s(obj, 2)
    expect(returnsOfSetter).toEqual(obj)
    expect(g(obj)).toBe(2)
  })

  it('types', () => {
    const obj = { one: 1 }

    interface Options {
      one: number
    }
    const [s, g] = createMeta<Options>()
    expectTypeOf(s<Options>).parameter(1).toEqualTypeOf<Options>()

    const returnsOfSetter = s(obj, { one: 1 })
    expectTypeOf(returnsOfSetter).toEqualTypeOf<typeof obj>()
    expectTypeOf(g(obj)).toEqualTypeOf<Options | undefined>()
    expectTypeOf(g<string>(obj)).toEqualTypeOf<string | undefined>()
  })

  it('object destruct', () => {
    const obj = { one: 1 }

    const { set, get } = createMeta()

    set(obj, { two: 2 })
    expect(get(obj)).toEqual({ two: 2 })
  })

  it('handle error', () => {
    const [s, g] = createMeta()

    const func = s(noop, 1)
    expect(g(func)).toBe(1)

    expect(g(undefined)).toBe(undefined)

    expect(() => s(undefined, 1)).toThrowError()
  })

  it('custom meta key', () => {
    const [s] = createMeta('__foo_bar')

    const obj = {}
    s(obj, 1)

    expect((obj as any).__foo_bar).toBe(1)
  })
})
