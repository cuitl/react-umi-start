import { useState } from 'react'
import { defineComponent } from '@utils/reactive'
import { ref, Ref } from '@vue/reactivity'
import { Button } from 'antd'
import * as store from './store'

interface CounterProps {
  value?: number
}

interface CounterState {
  count: Ref<number>
  increase: () => void
  decrease: () => void
}

const Counter = defineComponent<CounterProps, CounterState>(
  props => {
    const count = ref(props.value || 0)

    const increase = () => {
      count.value++
    }
    const decrease = () => {
      count.value--
    }

    return {
      count,
      increase,
      decrease,
    }
  },
  ({ count, increase, decrease }) => {
    return (
      <div style={{ margin: '5px' }}>
        <Button onClick={decrease}>-</Button>
        <Button>{count}</Button>
        <Button onClick={increase}>+</Button>
      </div>
    )
  },
)

const Counter2 = defineComponent<CounterProps, CounterState>(
  () => {
    const { count, increase, decrease } = store as CounterState
    return {
      count,
      increase,
      decrease,
    }
  },
  ({ count, increase, decrease }) => {
    return (
      <div style={{ margin: '5px' }}>
        <Button onClick={decrease}>-</Button>
        <Button>{count}</Button>
        <Button onClick={increase}>+</Button>
      </div>
    )
  },
)

export default function ReactiveDemo() {
  const [toggle, setToggle] = useState(true)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ padding: '10px', color: 'green' }}>
        React + @vue/reactivity
      </h1>
      <Button onClick={() => setToggle(!toggle)}>Toggle</Button>
      <br />
      <h2>Single - 组件数据独立私有</h2>
      {toggle && <Counter value={1}></Counter>}
      {toggle && <Counter value={2}></Counter>}
      <br />
      <h2>Share - 组件数据共享</h2>
      {toggle && <Counter2></Counter2>}
      {toggle && <Counter2></Counter2>}
    </div>
  )
}
