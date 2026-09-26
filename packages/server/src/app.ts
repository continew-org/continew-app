import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { z } from 'zod'

/** 统一错误返回体（与 @continew-app/core 的 CmApiErrorBody 对齐） */
export function apiError(code: string, message: string, details?: unknown) {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } }
}

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
})

interface DemoItem {
  id: number
  title: string
  summary: string
}

/** 演示业务数据（内存态，重启重置） */
const demoItems: DemoItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `演示条目 ${i + 1}`,
  summary: `这是第 ${i + 1} 条演示数据的摘要，用于演示列表分页与详情跳转。`,
}))

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

/**
 * 演示刷新令牌接口：返回固定假 token，让 demo 的 401 恢复路径真实可执行。
 * 生产项目替换为真实刷新逻辑（校验 refreshToken、签发新 token 对）。
 */
app.post('/auth/refresh', zValidator('json', refreshSchema), (c) => {
  return c.json({
    token: `demo-token-${Date.now()}`,
    refreshToken: `demo-refresh-${Date.now()}`,
  })
})

/** 演示列表接口：分页返回业务数据 */
app.get('/demo/items', zValidator('query', listQuerySchema), (c) => {
  const { page, size } = c.req.valid('query')
  const start = (page - 1) * size
  const items = demoItems.slice(start, start + size)
  return c.json({ items, total: demoItems.length, page, size })
})

/** 演示详情接口：按 id 返回单条 */
app.get('/demo/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const item = demoItems.find(i => i.id === id)
  if (!item) {
    return c.json(apiError('not_found', '条目不存在'), 404)
  }
  return c.json(item)
})

app.notFound((c) => {
  return c.json(apiError('not_found', '接口不存在'), 404)
})

app.onError((err, c) => {
  console.error('[server] unhandled error:', err)
  return c.json(apiError('internal_error', '服务内部错误'), 500)
})

export default app
