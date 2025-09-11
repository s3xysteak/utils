import { describe, expect, it } from 'vitest'
import { objectGet } from './object'

describe('object', () => {
  it('objectGet', () => {
    expect(objectGet({ a: { b: 1 } }, 'a.b')).toBe(1)
    expect(objectGet({ a: [1] }, 'a[0]')).toBe(1)
    expect(objectGet({ a: [{ b: 1 }] }, 'a[0].b')).toBe(1)
    expect(objectGet({ friends: [{ name: 'me' }] }, 'friends[0].name')).toBe('me')
  })
})
