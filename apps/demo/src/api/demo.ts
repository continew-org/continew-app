import { http } from './http'

export interface DemoItem {
  id: number
  title: string
  summary: string
}

export interface DemoItemListResult {
  items: DemoItem[]
  total: number
  page: number
  size: number
}

export function fetchDemoItems(page: number, size: number) {
  return http.get<DemoItemListResult>('/demo/items', { page, size }, { silent: true })
}

export function fetchDemoItem(id: number) {
  return http.get<DemoItem>(`/demo/items/${id}`, undefined, { silent: true })
}
