import { execSync } from 'node:child_process'
import { expGenerator } from 'export-collector'

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

await expGenerator('./src', { include: antfuList, exclude: [
  'onDevFactory',
  'defineRequestAxiosFactory',
] })

execSync('unbuild', { stdio: 'inherit' })
