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
  ],
  numberList: ['toNumber', 'isInRange'],
  isList: ['isArray'],
  fpList: ['flow'],
} as const

const exportList = Object.values(exportMap).flat()

export type AutoImportMap = { [K in typeof exportList[number]]: string }
export function autoImport(map?: Partial<AutoImportMap>): Record<string, (string | [string, string])[]> {
  return {
    '@s3xysteak/utils': exportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}
