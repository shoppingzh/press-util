import { defineConfig } from 'rollup'
import ts from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    ts()
  ]
})
