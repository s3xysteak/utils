import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { sleep, timestamp } from '@antfu/utils'
import { createPromiseQueue } from './promise'

describe('createPromiseQueue', () => {
  it('should work', async () => {
    const p2 = vi.fn()
    const p1 = vi.fn()
    const p3 = vi.fn()

    let timeStart: number

    const timeOffset = () => Math.abs(timestamp() - timeStart)

    const queue = createPromiseQueue()

    queue
      .run(async () => {
        await sleep(30)
        return 2
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<number>()
        timeStart = timestamp()
        p2()
      })
      .run(async () => {
        await sleep(20)
        return 1
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<number>()
        p1(timeOffset() < 3)
      })
      .run(async () => {
        await sleep(100)
        return 'three'
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<string>()
        p3(timeOffset() > 50)
      })

    await queue.wait()
    expect(p1).toHaveBeenCalledWith(true)
    expect(p2).toHaveBeenCalled()
    expect(p3).toHaveBeenCalledWith(true)
  })
})
