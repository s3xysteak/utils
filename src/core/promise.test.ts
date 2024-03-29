import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { sleep, timestamp } from '@antfu/utils'
import { createPromiseQueue, toPromise } from './promise'

describe('createPromiseQueue', () => {
  it('should work', async () => {
    const p3 = vi.fn()
    const p2 = vi.fn()
    const p10 = vi.fn()

    let timeStart: number

    const timeOffset = () => Math.abs(timestamp() - timeStart)

    const queue = createPromiseQueue()

    queue
      .run(async () => {
        await sleep(30)
        return 3
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<number>()
        timeStart = timestamp()
        p3()
      })
      .run(async () => {
        await sleep(20)
        return 2
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<number>()
        p2(timeOffset() < 3)
      })
      .run(async () => {
        await sleep(100)
        return 'ten'
      }, (v) => {
        expectTypeOf(v).toEqualTypeOf<string>()
        p10(timeOffset() > 50)
      })

    await queue.wait()
    expect(p3).toHaveBeenCalled()
    expect(p2).toHaveBeenCalledWith(true)
    expect(p10).toHaveBeenCalledWith(true)
  })

  it('should work with forEach', async () => {
    const p3 = vi.fn()
    const p2 = vi.fn()
    const p10 = vi.fn()

    let timeStart: number

    const timeOffset = () => Math.abs(timestamp() - timeStart)

    const queue = createPromiseQueue()

    const arr = [3, 2, 10]

    arr.forEach((v) => {
      queue.run(async () => {
        await sleep(v * 10)
        return v
      }, (val) => {
        expectTypeOf(val).toEqualTypeOf<number>()
        if (val === 3)
          timeStart = timestamp()

        val === 2 && p3()
        val === 3 && p2(timeOffset() < 3)
        val === 10 && p10(timeOffset() > 50)
      })
    })

    await queue.wait()
    expect(p3).toHaveBeenCalled()
    expect(p2).toHaveBeenCalledWith(true)
    expect(p10).toHaveBeenCalledWith(true)
  })

  it('should work with async callback', async () => {
    const p3 = vi.fn()
    const p2 = vi.fn()
    const p10 = vi.fn()

    let timeStart: number

    const timeOffset = () => Math.abs(timestamp() - timeStart)

    const queue = createPromiseQueue()

    const arr = [3, 2, 10]

    arr.forEach((v) => {
      queue.run(async () => {
        await sleep(v * 10)
        return v
      }, async (val) => {
        expectTypeOf(val).toEqualTypeOf<number>()
        if (val === 3)
          timeStart = timestamp()

        val === 2 && p3()
        val === 3 && p2(timeOffset() < 3)
        val === 10 && p10(timeOffset() > 50)
      })
    })

    await queue.wait()
    expect(p3).toHaveBeenCalled()
    expect(p2).toHaveBeenCalledWith(true)
    expect(p10).toHaveBeenCalledWith(true)
  })
})

describe('toPromise', () => {
  const t = async (v: any) => {
    expect(toPromise(v)).toBeInstanceOf(Promise)
    expect(await toPromise(v)).toBe(1)
  }

  it('should work with promise', async () => {
    const fn = async () => 1

    const p: Promise<number> = fn()

    await t(p)
  })

  it('should work with value', async () => {
    const p: number = 1

    await t(p)
  })

  it('should work with function which returns value', async () => {
    const fn = () => 1

    await t(fn)
  })

  it('should work with function which returns promise', async () => {
    const fn = async () => 1

    await t(fn)
  })
})
