import { createImport } from 'auto-import-helper'
import pkg from '../package.json'

/** auto-import-helper */
export default createImport(pkg.name, ['at', 'createMeta', 'createPromiseQueue', 'groupBy', 'isArray', 'isBoolean', 'isDate', 'isDef', 'isFunction', 'isInRange', 'isNull', 'isNumber', 'isObject', 'isPromise', 'isRegExp', 'isString', 'isUndefined', 'noop', 'pipe', 'sleep', 'toArray', 'toLF', 'toNumber', 'toPromise', 'uniq'] as const)
