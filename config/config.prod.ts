import { defineConfig } from 'umi'

console.log('prod环境构建')
export default defineConfig({
  hash: true,
  esbuild: false,
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },
})
