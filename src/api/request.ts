import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const API_VERSION_PREFIX = 'api'
const DEFAULT_TIMEOUT = 600000 // 10分钟

function handleBizError(
  response: AxiosResponse<{ code: number; msg: string }>,
) {
  const {
    data: { code, msg },
  } = response

  throw Error(`${code}: ${msg}`)
}

// 开发环境｜开启了mock数据部分拦截｜接口指定mock数据 -> 处理 baseURL
const handleMockRequestConfig = (config: AxiosRequestConfig) => {
  if (process.env.NODE_ENV === 'development' && MSW_MOCK === 2) {
    const isPartMock = config.url?.includes('__mock')
    if (isPartMock) {
      const baseURL = `https://dev.mock.com${config.baseURL}`
      console.info(
        `${config.baseURL}${config.url} 【is using mock path】-> ${baseURL}${config.url}`,
      )
      return Object.assign({}, config, {
        baseURL,
      })
    }
    return config
  }
  return config
}

export default function requestFactory(apiNamespace: string) {
  const instance = axios.create({
    baseURL: `/${API_VERSION_PREFIX}/${apiNamespace}`,
    timeout: DEFAULT_TIMEOUT,
  })
  // 请求拦截器
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // const account = LSM.get(LOCALSTORAGE_KEYS.ACCOUNT_ADDRESS) || '';
    // const chainId = LSM.get(LOCALSTORAGE_KEYS.CHAIN_ID) || `${HECO_CHAIN_ID}`;
    // return {
    //   ...config,
    //   headers: {
    //     ...config.headers,
    //     addr: account,
    //     chainId,
    //   },
    // };

    const configHandled = handleMockRequestConfig(config)
    return configHandled
  })
  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<{ code: number; data: any; msg: string }>) => {
      // 处理http错误
      if (response.status !== 200) {
        return console.error('网络错误')
      }
      const { data } = response
      // 处理业务错误
      switch (data.code) {
        case 200:
          return data.data
        default:
          return handleBizError(response)
      }
    },
  )

  return instance
}
