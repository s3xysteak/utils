import { describe, expect, it } from 'vitest'
import { groupBy } from './array'

describe('groupBy', () => {
  it('should work with empty array', () => {
    const arr: any[] = []
    expect(groupBy(arr, 'nothing')).toEqual({})
  })

  it('should work with one element', () => {
    const arr = [{ a: 1, b: 2 }]
    expect(groupBy(arr, 'a')).toEqual({ 1: [{ a: 1, b: 2 }] })
  })

  const arrMul = [
    { type: 'apple', size: 2 },
    { type: 'banana', size: 3 },
    { type: 'pear', size: 2 },
    { type: 'mango', size: 1 },
    { type: 'apple', size: 4 },
    { type: 'banana', size: 6 },
    { type: 'pear', size: 6, special: true },
  ]
  const targetMul = {
    apple: [
      { type: 'apple', size: 2 },
      { type: 'apple', size: 4 },
    ],
    banana: [
      { type: 'banana', size: 3 },
      { type: 'banana', size: 6 },
    ],
    pear: [
      { type: 'pear', size: 2 },
      { type: 'pear', size: 6, special: true },
    ],
    mango: [
      { type: 'mango', size: 1 },
    ],
  }

  it('should work with multi element', () => {
    expect(groupBy(arrMul, 'type')).toEqual(targetMul)
  })

  it('should work with cb', () => {
    expect(groupBy(arrMul, item => item.type)).toEqual(targetMul)
  })
})
