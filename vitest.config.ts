import { defaultExclude, defineConfig } from 'vitest/config'
import alias from './alias'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [
      ...defaultExclude,
      'e2e/*',
      '**/public/**',
      '**/.{vscode,svn}/**',
    ],
    typecheck: {
      enabled: true,
    },
    alias,
  },
})
