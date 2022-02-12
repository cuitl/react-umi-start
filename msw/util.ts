import Mock from 'mockjs'

interface BaseResponse {
  code: number
  msg: string
  data?: any
  [key: string]: any
}

const baseResponse: BaseResponse = {
  code: 200,
  msg: 'OK',
}

// 转化 mockjs模版
const mocker = (template: Object) => {
  return Object.assign({}, baseResponse, Mock.mock(template))
}

export default mocker
