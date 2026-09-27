import type { MiddlewareHandler } from 'hono'
import { apiError } from '../utils/api-error'

/** 演示访问令牌有效期：过期后写接口返回 401，触发客户端「单飞刷新令牌 → 重试」链路 */
const TOKEN_TTL_MS = 60 * 60 * 1000

/**
 * 登录态校验：要求 Bearer 访问令牌。
 * 演示实现只校验「存在 + 未过期」（令牌即签发时间戳），生产项目替换为 JWT 签名校验或会话查询。
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const issuedAt = Number(token.slice('demo-token-'.length))
  if (!token.startsWith('demo-token-') || !Number.isFinite(issuedAt)) {
    return c.json(apiError('unauthorized', '请先登录'), 401)
  }
  if (Date.now() - issuedAt > TOKEN_TTL_MS) {
    return c.json(apiError('unauthorized', '登录已过期'), 401)
  }
  await next()
}
