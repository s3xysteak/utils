// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = ["at","createPromiseQueue","flow","groupBy","isArray","isBoolean","isDate","isDef","isFunction","isInRange","isNull","isNumber","isObject","isRegExp","isString","isUndefined","noop","notUndefined","sleep","toArray","toLF","toNumber","toPromise","uniq"] as const

/**
 * @returns Call in `resolvers` option of `unplugin-auto-import`.
 */
export default function autoImport(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>) {
  return (name: string) => {
    if (!__UnExportList.includes(name as any))
      return

    return map && (map as any)[name]
      ? {
          name,
          as: (map as any)[name],
          from: '@s3xysteak/utils',
        }
      : {
          name,
          from: '@s3xysteak/utils',
        }
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
