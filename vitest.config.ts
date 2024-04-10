import { defaultExclude, defineConfig } from 'vitest/config'

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
  },
})
