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
]

const exportList = [...antfuList]

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map: Partial<AutoImportMap>) {
  return {
    [name]: exportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}
