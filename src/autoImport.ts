import { name } from '../package.json'

const antfuList = [
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
]

const fpTsList = ['flow']

const exportList = [...antfuList, ...fpTsList]

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map: Partial<AutoImportMap>) {
  return {
    [name]: exportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}
