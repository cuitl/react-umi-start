import { defineConfig } from 'umi'

console.log('test环境构建')
export default defineConfig({
  devtool: 'source-map',
  hash: true,
  esbuild: false,
  // terserOptions: {
  //   compress: {
  //     drop_console: true,
  //   },
  // },
})
