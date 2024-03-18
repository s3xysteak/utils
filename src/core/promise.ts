import { isFunction } from '@/index'

export function createPromiseQueue() {
  const list: Promise<any>[] = []

  /** Run promise and resolver */
  function run<T>(this: ReturnType<typeof createPromiseQueue>, promise: Promise<T> | (() => Promise<T>), cb: (value: T) => void) {
    const p = isFunction(promise) ? promise() : promise
    const index = list.push(p) - 1

    p.then(async (v) => {
      index > 0 && await Promise.allSettled([list[index - 1]])
      cb(v)
    })

    return this
  }

  /** Will be called after all Promise tasks are resolved */
  const wait = async () => {
    await Promise.allSettled(list)
  }

  return {
    run,
    wait,
  }
}
