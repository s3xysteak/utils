/// <reference types="vitest" />

import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

import AutoImport from 'unplugin-auto-import/vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: 'types/auto-imports.d.ts',
    }),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      formats: ['es'],
      entry: './src/index.ts',
      fileName: 'index',
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies || {}),
    },
  },
  test: {
    environment: 'node',
    exclude: [
      ...configDefaults.exclude,
      'e2e/*',
      '**/public/**',
      '**/.{vscode,svn}/**',
    ],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
