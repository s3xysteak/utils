import { execSync } from 'node:child_process'
import { transformFile } from 'auto-import-helper'

const set = new Set([
  ...Object.keys(await import('../src/core')),
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
  'noop',
  'toArray',
  'at',
  'uniq',
  'sleep',
])
set.delete('onDevFactory')

await transformFile(
  new URL('../src/import.ts', import.meta.url),
  [...set].sort(),
)

// just fix your style!
execSync('eslint . --fix src/import.ts')
