import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    json(),
    eslint(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.ts'], // 添加 .ts 扩展名
      exclude: 'node_modules/**', // 排除 node_modules 中的文件
    }),
  ],
};

export default config;
