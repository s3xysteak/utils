import type { Callable } from '..'

type CreatePromiseQueueReturns = ReturnType<typeof createPromiseQueue>

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
 * // Will be called after all Promise tasks are resolved
 * await queue2.wait()
 * // log `3` on 30ms, log `2` on next tick, log `10` on 100ms
 * ```
 */
export function createPromiseQueue() {
  const list: Array<Callable<Promise<any>>>[] = []

  function run<T>(
    this: CreatePromiseQueueReturns,
    promise: Callable<Promise<T>>,
    callback: (value: T) => Awaitable<void>,
  ): CreatePromiseQueueReturns {
    const p = isFunction(promise) ? promise() : promise
    const cb = async (v: T) => callback(v)
    const index = list.push([p, cb]) - 1

    p.then(async (v) => {
      if (index > 0)
        await Promise.allSettled(list[index - 1])

      await cb(v)
    })

    return this
  }

  const wait = async () => {
    await Promise.allSettled(list.flat())
  }

  return {
    run,
    wait,
  }
}

/**
 * Make any input as a promise.
 *
 * If the input is a function, call it.
 *
 * @example
 * await toPromise('hi') // -> 'hi'
 * await toPromise(1) // -> 1
 * await toPromise(Promise.resolve(1)) // -> 1
 * await toPromise(() => 1) // -> 1
 * await toPromise(async () => 1) // -> 1
 */
export function toPromise<T>(param: Callable<Awaitable<T>>): Promise<T> {
  const cb = async () =>
    isFunction(param) ? param() : param

  return cb()
}

type Awaitable<T> = T | PromiseLike<T>
// eslint-disable-next-line ts/no-unsafe-function-type
function isFunction<T extends Function>(val: any): val is T {
  return typeof val === 'function'
}
