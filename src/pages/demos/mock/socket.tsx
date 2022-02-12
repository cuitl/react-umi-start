/**
 * @file Websocket 相关demos
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space, Input, Timeline, Card, Divider } from 'antd'
import dayjs from 'dayjs'

const getJSONOrString = (data: string) => {
  let result
  try {
    result = JSON.parse(data)
  } catch {
    result = data.toString()
  }
  return result
}

const mockWebsocketUrl = 'ws://localhost:9000/demo'

export default function SocketDemo() {
  const [serverTime, setServerTime] = useState<number>()
  const [randomMsg, setRandomMsg] = useState('')
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const wsRef = useRef<WebSocket>()

  const serverTimeFormat = useMemo(() => {
    if (serverTime) {
      return dayjs(serverTime).format('YYYY-MM-DD HH:mm:ss')
    }
    return ''
  }, [serverTime])

  useEffect(() => {
    const ws = new WebSocket(mockWebsocketUrl)
    wsRef.current = ws
    ws.onopen = function (e) {
      console.log('连接成功', e)
      ws.send('我连上了，哈哈')
      // 获取服务器时间
      ws.send(
        JSON.stringify({
          event: 'time',
        }),
      )
    }

    ws.onclose = function (e) {
      console.log('连接关闭', e)
    }

    ws.onerror = function (e) {
      console.log('连接失败', e)
    }

    ws.onmessage = function (e) {
      const { data } = e
      const serverData = getJSONOrString(data)

      if (typeof serverData === 'object') {
        if (serverData.event === 'random') {
          console.log('serverData JSON ', serverData)
          setRandomMsg(serverData.data)
        } else if (serverData.event === 'time') {
          setServerTime(serverData.data)
        }
        return
      }

      if (data.startsWith('dialog:')) {
        const [, msg] = data.split(':')
        setMessages(arr => [...arr, msg])
      } else {
        console.log('received: %s', data)
      }
    }
    return () => {
      ws.send(
        JSON.stringify({
          event: 'stopTime',
        }),
      )
      ws.close()
    }
  }, [])

  const sendTo = () => {
    if (value && wsRef.current) {
      wsRef.current.send(`dialog:${value}`)
      setMessages(arr => [...arr, `${value} - Client`])
      setValue('')
    }
  }

  const getRandom = (type: string) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          event: 'random',
          type,
        }),
      )
    }
  }

  return (
    <>
      <Card>
        <Space>
          <Input
            placeholder="服务对话"
            value={value}
            onChange={e => setValue(e.target.value)}
          ></Input>
          <Button onClick={sendTo}>Send</Button>
        </Space>

        <Divider></Divider>
        <Timeline mode="alternate">
          {messages.map((msg, index) => (
            <Timeline.Item key={index} color={index % 2 ? 'green' : 'red'}>
              {msg}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      <Card>
        <Space>
          <Button onClick={() => getRandom('paragraph')}>一段文章</Button>
          <Button onClick={() => getRandom('name')}>随机人名</Button>
        </Space>
        <br />
        <br />
        <Input.TextArea value={randomMsg} rows={6}></Input.TextArea>
      </Card>

      <Card>
        服务器时间： <em style={{ color: 'red' }}>{serverTimeFormat}</em>
      </Card>
    </>
  )
}
