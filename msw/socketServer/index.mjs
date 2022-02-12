/**
 * @file 模拟 服务端 websocket 服务，用于开发、测试
 * node 直接运行ts有点问题，直接使用 .mjs 进行编写
 * 根据路径(自定义)映射不同的 socket服务：
 *                      /demo 用于 /demos/ws 页面的连接示例
 *                      /buisness 用于项目本身的具体的数据mock TODO
 *
 * TODO 具体数据模拟视具体情况而定
 */

import { createServer } from 'http'
import demoWss from './demoSocket.mjs'
import buisnessWs from './buisnessSocket.mjs'

const server = createServer()

// 根据路径 控制服务映射
server.on('upgrade', function upgrade(request, socket, head) {
  // const urlParse = new URL(request.url);
  // const { pathname } = urlParse;
  const pathname = request.url

  if (pathname === '/demo') {
    demoWss.handleUpgrade(request, socket, head, function done(ws) {
      demoWss.emit('connection', ws, request)
    })
  } else if (pathname === '/buisness') {
    buisnessWs.handleUpgrade(request, socket, head, function done(ws) {
      buisnessWs.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(9000)
