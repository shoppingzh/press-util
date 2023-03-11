import path from 'path'
import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import sizes from '@atomico/rollup-plugin-sizes'
import ts from '@rollup/plugin-typescript'
import beep from '@rollup/plugin-beep'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import clear from 'rollup-plugin-clear'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  external: Object.keys((pkg as any).peerDependencies || {}),
  plugins: [
    alias({
      entries: [
        {
          find: '@',
          replacement: 'src',
        },
      ],
    }),
    clear({
      targets: ['dist'],
    }),
    ts({
      tsconfig: path.resolve(__dirname, './tsconfig.build.json'),
    }),
    // 生成包大小监控
    sizes(100),
    // 代码混淆
    terser(),
    // 警告
    beep(),
  ],
})
