import { describe, expect, expectTypeOf, it } from 'vitest'
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

    s(obj, 2)
    expect(g(obj)).toBe(2)
  })

  it('types', () => {
    const obj = { one: 1 }

    interface Options {
      one: number
    }
    const [s, g] = createMeta<Options>()

    s(obj, { one: 1 })
    expectTypeOf(s).parameter(1).toEqualTypeOf<Options>()
    expectTypeOf(g(obj)).toEqualTypeOf<Options>()
  })
})
