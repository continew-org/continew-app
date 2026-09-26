import { describe, expect, it } from 'vitest'
import app from '../src/app'

interface ErrorBody {
  error: { code: string, message: string, details?: unknown }
}

describe('server /auth/refresh', () => {
  it('返回新 token 对', async () => {
    const res = await app.request('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { token: string, refreshToken: string }
    expect(body.token).toMatch(/^demo-token-/)
    expect(body.refreshToken).toMatch(/^demo-refresh-/)
  })

  it('缺少 refreshToken 返回 400', async () => {
    const res = await app.request('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})

describe('server /demo/items', () => {
  it('分页返回列表', async () => {
    const res = await app.request('/demo/items?page=2&size=8')
    expect(res.status).toBe(200)
    const body = await res.json() as { items: unknown[], total: number, page: number, size: number }
    expect(body.items).toHaveLength(8)
    expect(body.total).toBe(30)
    expect(body.page).toBe(2)
  })

  it('详情按 id 返回', async () => {
    const res = await app.request('/demo/items/3')
    expect(res.status).toBe(200)
    const body = await res.json() as { id: number, title: string }
    expect(body.id).toBe(3)
  })

  it('详情不存在返回 404', async () => {
    const res = await app.request('/demo/items/999')
    expect(res.status).toBe(404)
    const body = await res.json() as ErrorBody
    expect(body.error.code).toBe('not_found')
  })
})
