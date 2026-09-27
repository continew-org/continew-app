import type { ValidationTargets } from 'hono'
import type { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { apiError } from './api-error'

/**
 * zValidator + 统一错误形状：入参非法一律 400 + invalid_input，
 * details 携带字段级错误（flatten），客户端 ApiError 可直接展示 message。
 */
export function validate<Target extends keyof ValidationTargets, T extends z.ZodTypeAny>(
  target: Target,
  schema: T,
) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(apiError('invalid_input', '入参非法', result.error.flatten()), 400)
    }
  })
}
