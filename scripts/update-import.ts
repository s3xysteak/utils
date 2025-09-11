import * as fs from 'node:fs/promises'
import { createSearch } from 'auto-import-helper'

const set = new Set([
  ...Object.keys(await import('../src/core')),
])
set.delete('onDevFactory')

await writeTo('src/import.ts', 'createImport', [...set])

async function writeTo(path: string | URL, searchTarget: Parameters<typeof createSearch>[0], names: string[]) {
  const search = createSearch(searchTarget)
  const code = await fs.readFile(path, 'utf-8')

  const val = search(code)
  if (!val) {
    throw new Error('no target')
  }
  const [start, end] = val

  await fs.writeFile(path, code.slice(0, start) + JSON.stringify([...names].sort()) + code.slice(end))
}
