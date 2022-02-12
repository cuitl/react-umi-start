/* eslint-disable */
/**
 * @file 处理接口mock数据
 */
import Mocker from './util'
import { rest, RestHandler } from 'msw'

// url 匹配
const urlReg = (path: string) => {
  const idreg = /:\w+/g
  // 匹配id占位，如: /:id, 并转化为正则
  path = path.replace(idreg, '[\\d]+')
  if (MSW_MOCK === 2) {
    // 部分接口开启mock 数据
    return new RegExp(`https:\/\/dev.mock.com\/api${path}`)
  }
  return new RegExp(`\/api${path}`)
}

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

// ---------------------------- defualt interceptor ----------------------------------------

const _defaultMock = (req: any, res: any, ctx: any) => {
  console.log('default get mocks')
  return res(
    ctx.json(
      Mocker({
        data: [],
      }),
    ),
  )
}

const defaultMock: RestHandler[] = [
  rest.get(urlReg('/*'), _defaultMock),
  rest.post(urlReg('/*'), _defaultMock),
  rest.put(urlReg('/*'), _defaultMock),
  rest.delete(urlReg('/*'), _defaultMock),
]

export default defaultMock
