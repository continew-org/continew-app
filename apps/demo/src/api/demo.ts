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

export interface DemoItemPayload {
  title: string
  summary?: string
}

export function fetchDemoItems(page: number, size: number) {
  return http.get<DemoItemListResult>('/demo/items', { page, size }, { silent: true })
}

export function fetchDemoItem(id: number) {
  return http.get<DemoItem>(`/demo/items/${id}`, undefined, { silent: true })
}

export function createDemoItem(payload: DemoItemPayload) {
  return http.post<DemoItem>('/demo/items', payload)
}

export function updateDemoItem(id: number, payload: DemoItemPayload) {
  return http.put<DemoItem>(`/demo/items/${id}`, payload)
}

export function deleteDemoItem(id: number) {
  return http.del<{ ok: boolean }>(`/demo/items/${id}`)
}

/** 列表脏标记：新增 / 编辑成功后置位，列表页 onShow 时消费并刷新（跨页通知的最小实现） */
let listDirty = false

export function markListDirty() {
  listDirty = true
}

export function consumeListDirty() {
  const dirty = listDirty
  listDirty = false
  return dirty
}
