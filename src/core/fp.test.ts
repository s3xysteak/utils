import { describe, expect, expectTypeOf, it } from 'vitest'
import { flow } from '..'

describe('flow', () => {
  it('should work with one func', () => {
    const add = (a: number, b: number) => a + b

    const val = flow(add)
    expectTypeOf(val).toEqualTypeOf<typeof add>()
    expect(val(1, 2)).toBe(3)
  })

  it('should work with two funcs', () => {
    const add = (a: number, b: number) => a + b
    const square = (n: number) => `${n * n}`

    const val = flow(add, square)

    expectTypeOf(val).toEqualTypeOf<(...args: Parameters<typeof add>) => ReturnType<typeof square>>()
    expect(val(1, 2)).toBe('9')
  })

  it('should work with three funcs', () => {
    const add = (a: number, b: number) => a + b
    const square = (n: number) => `${n * n}`
    const toStr = (n: string) => `The result is ${n}`

    const val = flow(add, square, toStr)

    expectTypeOf(val).toEqualTypeOf<(...args: Parameters<typeof add>) => ReturnType<typeof toStr>>()
    expect(val(1, 2)).toBe('The result is 9')
  })
})
