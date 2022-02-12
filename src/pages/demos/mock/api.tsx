/**
 * @file API mock demos
 */

import { useEffect, useState } from 'react'
import { Button, Tag, Spin, Card, Space } from 'antd'
import { getTags, TagItem } from '@api/list.api'
import { RedoOutlined } from '@ant-design/icons'

export default function ApiDemos() {
  const [tagList, setTagList] = useState<TagItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getTagsList = () => {
    setLoading(true)
    getTags()
      .then((data: any) => {
        setTagList(data.list as TagItem[])
        console.log('res------', data)
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }

  useEffect(() => {
    getTagsList()
  }, [])

  return (
    <Card
      title="Tag List"
      style={{ width: '90%', margin: '10px auto' }}
      extra={
        <RedoOutlined
          onClick={getTagsList}
          style={{ cursor: 'pointer', color: '#1dbd1d', fontSize: '16px' }}
        />
      }
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {loading ? (
          <Spin></Spin>
        ) : (
          tagList.map(tag => <Tag key={tag.id}>{tag.symbol}</Tag>)
        )}
      </div>
    </Card>
  )
}
