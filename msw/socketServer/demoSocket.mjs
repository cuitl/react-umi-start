/**
 * @file 路径为： /demo的 websocket服务
 * 用于 /demos/ws 页面的 websocket 连接示例
 */
import { WebSocketServer } from 'ws'
import { getJSONOrString, getRandom, serverTimer } from './utils.mjs'

// 信息处理接收 demo
const wsMessgaeHandleDemo = function (ws) {
  ws.on('message', function message(data) {
    const clientData = getJSONOrString(data)

    if (typeof clientData === 'string') {
      const dataStr = data.toString()
      if (dataStr.indexOf('dialog:') > -1) {
        const [, msg] = dataStr.split(':')
        ws.send(`dialog:${msg} -> Server`)
      } else {
        console.log('received: %s', dataStr)
      }
    } else {
      const { event, type } = clientData

      switch (event) {
        case 'random':
          ws.send(
            JSON.stringify({
              event,
              type,
              data: getRandom(type),
            }),
          )
          break
        case 'time':
          ws.send(
            JSON.stringify({
              event,
              data: +new Date(),
            }),
          )

          serverTimer.run(() => {
            ws.send(
              JSON.stringify({
                event,
                data: +new Date(),
              }),
            )
          })
          break

        case 'stopTime':
          serverTimer.stop()
          break

        default:
          ws.send(`unknow event: ${event}`)
          break
      }
    }
  })
}

const demoWss = new WebSocketServer({ noServer: true })

export default demoWss

demoWss.on('listening', function () {
  console.log('/demo: websocket mock 服务创建成功')
})

demoWss.on('connection', function connection(ws) {
  console.log(`/demo: 连接成功!`)

  wsMessgaeHandleDemo(ws)

  ws.send('/demo: connection create sucessful!')
})

demoWss.on('error', function (err) {
  console.log('/demo: websocket mock 服务创建失败', err)
})

demoWss.on('close', function () {
  console.log('/demo: websocket mock服务, 已关闭!')
})
