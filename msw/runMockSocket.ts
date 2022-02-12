/**
 * @file 运行｜调用 socketServer.mjs 服务
 * 在 UMI 运行过程中, 以 child_process的形式进行运行, 便用控制服务的启动和结束.
 */
import process from 'process'
import { fork } from 'child_process'
import chalk from 'chalk'

// 创建 node 子进程，用于启动 websocket 便于本地mock
const createChildProcessForSocket = () => {
  // AbortController node 15.0后才支持，建议node升级到当前稳定版本
  const controller = new AbortController()
  const { signal } = controller

  const childSocket = fork('./msw/socketServer/index.mjs', ['child'], {
    signal,
  })
  childSocket.on('spawn', () => {
    console.log(
      chalk.greenBright(
        '   ✔ Mock: 创建子进程执行 mock websocket服务成功 ✔ \n',
      ),
    )
  })
  // childSocket.on('error', () => {
  //   console.log('创建子进程执行 mock websocket服务失败');
  // });
  return controller
}

let socketController: AbortController | undefined

process.on('exit', code => {
  if (socketController && (global as any).hasRunMockWebsocket) {
    socketController.abort()
    socketController = undefined
    ;(global as any).hasRunMockWebsocket = false
    console.log(chalk.gray(` \n > UMI进程退出，终止 websocket 子进程: ${code}`))
  }
})

export default function runMockWebsocket() {
  if (!socketController && !(global as any).hasRunMockWebsocket) {
    console.log(chalk.blueBright('● 启动: 对 Websocket的 MOCK 服务, start！'))
    socketController = createChildProcessForSocket()
    ;(global as any).hasRunMockWebsocket = true
  }
}
