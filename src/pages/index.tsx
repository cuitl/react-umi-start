import { useState, useEffect } from 'react'
import { Button, Space } from 'antd'
import styles from './index.less'

const Counter = () => {
  const [count, setCount] = useState(0)

  const increase = () => {
    setCount(n => n + 1)
  }

  const decrease = () => {
    setCount(n => n - 1)
  }

  useEffect(() => {
    console.log('counter mounted')
  }, [])

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '5px 10px',
        border: '1px dashed #ccc',
      }}
    >
      <Space>
        <Button onClick={decrease}>-</Button>
        <Button type="text">{count}</Button>
        <Button onClick={increase}>+</Button>
      </Space>
    </div>
  )
}

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>

      <Counter></Counter>
    </div>
  )
}
