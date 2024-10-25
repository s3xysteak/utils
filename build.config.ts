import { defineBuildConfig } from 'unbuild'
import pkg from './package.json'

export default defineBuildConfig({
  externals: Object.keys(pkg.dependencies || {}),
})
