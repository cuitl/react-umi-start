/**
 * @file Demos
 */
import { Link } from 'umi'
import { Button, Tag, Spin, Card, Space } from 'antd'

export default function Demos() {
  return (
    <Card>
      <Space direction="vertical">
        <Link to="/demos/mock/api">Mock Api</Link>
        <Link to="/demos/mock/socket">Socket Api</Link>
        <Link to="/demos/reactive">React + @vue/reactivity</Link>
      </Space>
    </Card>
  )
}
