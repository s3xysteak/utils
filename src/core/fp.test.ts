import { describe, expect, it } from 'vitest'
import { pipe } from '..'

describe('fp', () => {
  it('pipe', () => {
    const fn = pipe(
      (v: number) => v + 1,
      v => v * 2,
    )
    expect(fn(1)).toBe(4)
  })
})
