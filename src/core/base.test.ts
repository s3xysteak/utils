import { describe, expect, it } from 'vitest'
import { toLF } from './base'

describe('base', () => {
  it('toLF', () => {
    const crlf = 'hello\r\nworld'
    const lf = 'hello\nworld'
    expect(toLF(crlf)).toBe(lf)
  })
})
