import { defineBuildConfig } from 'unbuild'
import ExportCollector from 'unplugin-export-collector/rollup'

import pkg from './package.json'

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

  'noop',
  'toArray',
  'at',
  'uniq',
  'sleep',
]

const include = [...antfuList]

export default defineBuildConfig({
  externals: Object.keys(pkg.dependencies || {}),
  hooks: {
    'rollup:options': (_, options) => {
      options.plugins = [
        ...(options.plugins as any[]),
        ExportCollector({
          include,
          exclude: [
            'onDevFactory',
          ],
        }),
      ]
    },
  },
})
