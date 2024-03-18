import { isFunction } from '@/index'

/**
 * Create a promise queue. Concurrently run promise, but executing callbacks synchronously in order.
 * @example
 * ```ts
 * const queue1 = createPromiseQueue()
 *
 * // Run promise and resolver
 * queue1
 *  .run(async () => { await sleep(30) }, () => console.log('3'))
 *  .run(async () => { await sleep(20) }, () => console.log('2'))
 *  .run(async () => { await sleep(100) }, () => console.log('ten'))
 * // log `3` on 30ms, log `2` on next moment, log `ten` on 100ms
 *
 * // Or
 *
 * const queue2 = createPromiseQueue()
 * const arr = [3, 2, 10]
 *
 * arr.forEach((v) => {
 *   queue2.run(async () => { await sleep(v*10); return val }, (val) => console.log(String(val)))
 * })
 *
 * //Will be called after all Promise tasks are resolved
 * await queue2.wait()
 * // log `3` on 30ms, log `2` on next tick, log `10` on 100ms
 * ```
 */
export function createPromiseQueue() {
  const list: Promise<any>[] = []

  function run<T>(
    this: ReturnType<typeof createPromiseQueue>,
    promise: Promise<T> | (() => Promise<T>),
    cb: (value: T) => void,
  ): ReturnType<typeof createPromiseQueue> {
    const p = isFunction(promise) ? promise() : promise
    const index = list.push(p) - 1

    p.then(async (v) => {
      index > 0 && await Promise.allSettled([list[index - 1]])
      cb(v)
    })

    return this
  }

  const wait = async () => {
    await Promise.allSettled(list)
  }

  return {
    run,
    wait,
  }
}
