/**
 * @file 路径为： /buisness 的 websocket服务
 * 用于项目业务的 websockt mock
 * TODO 具体mock 待自定义
 */
import { WebSocketServer } from 'ws'

const buisnessWs = new WebSocketServer({ noServer: true })

export default buisnessWs

buisnessWs.on('listening', function () {
  console.log('/buisness: websocket mock 服务创建成功')
})

buisnessWs.on('connection', function connection(ws) {
  console.log(`/buisness: 连接成功!`)

  // TODO:  your custom message handle content

  ws.send('/buisness: connection create sucessful!')
})

buisnessWs.on('error', function (err) {
  console.log('/buisness: websocket mock 服务创建失败', err)
})

buisnessWs.on('close', function () {
  console.log('/buisness: websocket mock服务, 已关闭!')
})
