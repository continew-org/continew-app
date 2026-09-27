import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRoutes } from './routes/auth'
import { demoRoutes } from './routes/demo'
import { apiError } from './utils/api-error'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

/** 业务路由：/auth 登录与会话、/demo 演示 CRUD（路由实现见 src/routes/） */
app.route('/auth', authRoutes)
app.route('/demo', demoRoutes)

app.notFound((c) => {
  return c.json(apiError('not_found', '接口不存在'), 404)
})

app.onError((err, c) => {
  console.error('[server] unhandled error:', err)
  return c.json(apiError('internal_error', '服务内部错误'), 500)
})

export default app
