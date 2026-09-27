import { Hono } from 'hono'
import { z } from 'zod'
import { apiError } from '../utils/api-error'
import { validate } from '../utils/validation'

interface SessionUserPayload {
  id: string
  nickname: string
  username?: string
}

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

const wechatSchema = z.object({
  code: z.string().min(1, '缺少微信登录 code'),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

/** 演示账号：生产项目替换为真实账号体系校验 */
const DEMO_ACCOUNT = { username: 'admin', password: '123456' }

function issueSession(user: SessionUserPayload) {
  return {
    token: `demo-token-${Date.now()}`,
    refreshToken: `demo-refresh-${Date.now()}`,
    user,
  }
}

/** 登录与会话：生产项目将演示实现替换为真实校验，返回体形状保持不变 */
export const authRoutes = new Hono()
  .post('/login', validate('json', loginSchema), (c) => {
    const { username, password } = c.req.valid('json')
    if (username !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
      return c.json(apiError('unauthorized', '用户名或密码错误'), 401)
    }
    return c.json(issueSession({ id: '1', nickname: '演示管理员', username }))
  })
  .post('/wechat', validate('json', wechatSchema), (c) => {
    // 演示实现：不真正调用微信 code2Session，任何 code 都视为登录成功
    return c.json(issueSession({ id: '2', nickname: '微信用户' }))
  })
  .post('/refresh', validate('json', refreshSchema), (c) => {
    // 演示实现：refreshToken 存在即签发新令牌对
    return c.json({
      token: `demo-token-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
    })
  })
