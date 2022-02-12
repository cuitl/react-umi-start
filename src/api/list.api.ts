import requestFactory from './request'
const http = requestFactory('tag')

export interface TagItem {
  id: number
  symbol: string
}
export function getTags() {
  return http.get<any, TagItem[]>('/list?__mock')
}
