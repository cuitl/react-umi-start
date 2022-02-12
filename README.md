# react-umi-start

umi for react start

使用 UMI 脚手架开发 React 应用的一些前置配置内容。

## MSW MOCK 数据

mock 数据使用 [MSW](https://mswjs.io/docs)库, mock 数据生成模版使用[mock.js](http://mockjs.com/examples.html)。

安装：

- yarn add msw mockjs -D
- yarn msw init public/ --save

  > 设置 `workerDirectory` 并 将 mockServiceWorker 存放到 `workerDirectory` (public) 中

- 配置接口 handlers 及 browser： 见对应的文件
- 定义环境变量并在 app.tsx 入口文件中控制 mock 的开启

开启 MSW MOCK 数据：

添加 `config/config.local.ts`

```js
import { defineConfig } from 'umi'

export default defineConfig({
  define: {
    // 设置变量 0 不开启 1 全部开启 2 部分开启
    MSW_MOCK: 1,
  },
})
```

`配置MSW MOCK数据: msw/handlers.ts 中进行配置`

```js
export const getTags = rest.get(urlReg('/tag/list'), (req, res, ctx) => {
  return res(
    ctx.json(
      Mocker({
        data: {
          'list|6-10': [
            {
              'id|+1': 1,
              symbol: '@string("upper", 3, 4)',
            },
          ],
        },
      }),
    ),
  )
})
```

MSW_MOCK:

- 0: 不开启
- 1: 全部开启 -> handlers.ts 配置的接口拦截都会生效
- 2: 部分开启 -> 需在接口 url 上添加 \_\_mock 表示
  ```js
    export function getTags() {
      return http.get<any, CoinItem[]>('/list?__mock');
    }
  ```

## Websocket MOCK

针对 Websocket 的 mock, 使用了 [ws](https://www.npmjs.com/package/ws) 来生成 node 端的服务, 同时由于项目中添加了[mockjs](http://mockjs.com/examples.html), 因此可以使用 `mockjs` 来生成一些随机数据。

Mock 的自定义内容， 参考 `./msw/socketServer/demoSocket.mjs`, 同时 `./msw/socketServer/buisness.mjs`为预留的项目相关的 mock 内容。

服务开启：

有几种方案，可以进行 websocket mock 服务的开启。

## 单独启动

- 1. 终端 1: 启动前端工程 -> `yarn start`
- 2. 终端 2: 启动 websocket 服务 -> `yarn socket`

## 跟随脚手架一起启动

> socket 服务以子进程的形式，运行在 UMI 的生命周期中。

Note: 注意服务的调用使用了 `AbortController` API, 此 API `node 15` 才会支持, 建议使用 node 当前的稳定版本，或使用 `nvm` 切换版本进行使用。

优点是，socket 服务会在 UMI 的生命周期中运行，UMI 结束运行，则也会结束运行。缺点时：目前 socket 服务配置内容修改后，并不会热更新，自动重启。

- 使用环境变量控制 socket 开启

  ```bash
    # 1. 添加 .env.local文件 - 与 package.json同级

      # .env.local 文件内容如下:
      # 设置变量，控制是否开启 websocket mock 0 不开启， > 0开启
      MOCK_SOCKET=1

    # 2. 全局添加 umi 依赖： yarn global add umi
    # 3. 执行命令： umi dev
  ```

- 添加 config.local.ts, 并在文件中调用

  > config.local.ts 用于本地覆盖 umi 配置的文件，不会上传到代码仓库，根据本地启动场景可以随时进行修改。

  ```ts
  // config/ 文件夹中添加  config.local.ts 文件

  import { defineConfig } from 'umi'
  // 引入执行方法
  import runMockSocket from '../msw/runMockSocket'

  export default defineConfig({
    define: {
      // 定义mock开启的变量 0 不开启 1 全部开启 2 部分开启
      MSW_MOCK: 2,
    },
  })

  // 运行 websocket mock 服务
  // 直接调用启动服务，不用时则进行注释
  runMockSocket()
  ```
