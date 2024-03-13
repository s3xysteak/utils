import { name } from '../package.json'

const exportMap = {
  antfuList: [
    'isDef',
    'isBoolean',
    'isFunction',
    'isNumber',
    'isString',
    'isObject',
    'isUndefined',
    'isNull',
    'isRegExp',
    'isDate',

    'sleep',
  ] as const,
  fpTsList: ['flow'] as const,
  numberList: ['toNumber', 'isInRange'] as const,
  isList: ['isArray'] as const,
}

const exportList = Object.values(exportMap).flat()

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map: Partial<AutoImportMap>) {
  return {
    [name]: exportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}
