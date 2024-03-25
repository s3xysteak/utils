export type Callable<T> = T | ((...args: any[]) => T)

export type ObjectKeys = string | number | symbol
