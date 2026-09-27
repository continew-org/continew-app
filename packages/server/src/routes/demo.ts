import { Hono } from 'hono'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { apiError } from '../utils/api-error'
import { validate } from '../utils/validation'

interface DemoItem {
  id: number
  title: string
  summary: string
}

const itemPayloadSchema = z.object({
  title: z.string().trim().min(1, '标题不能为空').max(50, '标题不能超过 50 字'),
  summary: z.string().trim().max(200, '摘要不能超过 200 字').default(''),
})

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
})

/** 演示业务数据（内存态，重启重置） */
const demoItems: DemoItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `演示条目 ${i + 1}`,
  summary: `这是第 ${i + 1} 条演示数据的摘要，用于演示列表分页与详情跳转。`,
}))

let nextId = demoItems.length + 1

/**
 * 演示 CRUD：读接口匿名可访问，写接口要求登录——
 * 未登录时写接口返回 401，触发客户端「登录跳转 / 单飞刷新令牌 → 重试」链路。
 */
export const demoRoutes = new Hono()
  .get('/items', validate('query', listQuerySchema), (c) => {
    const { page, size } = c.req.valid('query')
    const start = (page - 1) * size
    const items = demoItems.slice(start, start + size)
    return c.json({ items, total: demoItems.length, page, size })
  })
  .get('/items/:id', (c) => {
    const id = Number(c.req.param('id'))
    const item = demoItems.find(i => i.id === id)
    if (!item) {
      return c.json(apiError('not_found', '条目不存在'), 404)
    }
    return c.json(item)
  })
  .post('/items', requireAuth, validate('json', itemPayloadSchema), (c) => {
    const payload = c.req.valid('json')
    const item: DemoItem = { id: nextId++, ...payload }
    demoItems.unshift(item)
    return c.json(item, 201)
  })
  .put('/items/:id', requireAuth, validate('json', itemPayloadSchema), (c) => {
    const id = Number(c.req.param('id'))
    const index = demoItems.findIndex(i => i.id === id)
    if (index < 0) {
      return c.json(apiError('not_found', '条目不存在'), 404)
    }
    const updated: DemoItem = { id, ...c.req.valid('json') }
    demoItems[index] = updated
    return c.json(updated)
  })
  .delete('/items/:id', requireAuth, (c) => {
    const id = Number(c.req.param('id'))
    const index = demoItems.findIndex(i => i.id === id)
    if (index < 0) {
      return c.json(apiError('not_found', '条目不存在'), 404)
    }
    demoItems.splice(index, 1)
    return c.json({ ok: true })
  })
