import chalk from 'chalk'
import { defineConfig } from 'umi'
import runMockSocket from '../msw/runMockSocket'
import { log } from './log'

const apiEnv = process.env.API_ENV
const apiUrl = `https://dev.fontend.com/${apiEnv}`

log(chalk.blue.bold.underline(`Proxy|API: 被代理到 ${apiUrl} \n`))

export default defineConfig({
  define: {
    // 默认启动 部分接口的mock数据拦截
    MSW_MOCK: 2,
  },
  devServer: {
    port: 8000,
  },
  proxy: {
    '/api': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^//api': '',
      },
    },
  },
  devtool: 'source-map',
  esbuild: {},
})

// 环境变量 MOCK_SOCKET 控制是否启动 websocket mock
if (Number(process.env.MOCK_SOCKET)) {
  runMockSocket()
}
