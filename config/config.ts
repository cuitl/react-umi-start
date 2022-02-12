import { defineConfig } from 'umi'
import * as path from 'path'
import { log } from './log'

log(process.env.UMI_ENV, 'UMI_ENV................')

const srcPath = path.resolve(__dirname, '../src')

export default defineConfig({
  define: {
    // 定义mock开启的变量 0 不开启 1 全部开启 2 部分开启
    MSW_MOCK: 0,
  },
  // 模块儿按需加载
  dynamicImport: {},
  outputPath: 'dist',
  nodeModulesTransform: {
    type: 'none',
  },
  // 对按照 css modules 方式引入的 css 或 less 等样式文件，自动生成 ts 类型定义文件(*.less.d.ts)
  cssModulesTypescriptLoader: {},
  cssLoader: {
    localsConvention: 'camelCase',
  },
  // 开启 快速刷新
  fastRefresh: {},
  // 图片文件是否走 base64 编译的阈值, 默认 10000 (10k)
  inlineLimit: 10000 * 100, // 100k
  alias: {
    '@components': path.resolve(srcPath, 'components'),
    '@hooks': path.resolve(srcPath, 'hooks'),
    '@types': path.resolve(srcPath, 'types'),
    '@utils': path.resolve(srcPath, 'utils'),
    '@api': path.resolve(srcPath, 'api'),
    '@style': path.resolve(srcPath, 'style'),
  },

  // ----- plugin config below -----
  // https://umijs.org/plugins/plugin-locale
  locale: {
    baseNavigator: false,
    // 切换路由时 根据路由页面设置的 key值进行切换
    title: true,
    default: 'zh-CN',
  },
  // https://umijs.org/plugins/plugin-antd
  // 默认内置版本 ^4.0.0, 指定版本需要显式安装
  antd: {},
})
