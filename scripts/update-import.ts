import { execSync } from 'node:child_process'
import * as fs from 'node:fs/promises'
import { createSearch } from 'auto-import-helper'

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

await run()

async function run() {
  const search = createSearch('createImport')
  const path = new URL('../src/import.ts', import.meta.url)

  const code = await fs.readFile(path, 'utf-8')

  const val = search(code)
  if (!val)
    return
  const [start, end] = val

  await fs.writeFile(path, code.slice(0, start) + JSON.stringify([...set].sort()) + code.slice(end))

  // just fix your style!
  execSync('eslint --fix src/import.ts', { stdio: 'inherit' })
}
