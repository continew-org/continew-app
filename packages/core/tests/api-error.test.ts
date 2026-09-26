import { describe, expect, it } from 'vitest'
import { ApiError } from '../src/errors/api-error'

describe('apiError', () => {
  it('从服务端错误体构造', () => {
    const err = ApiError.fromBody(
      { error: { code: 'invalid_input', message: '标题不能为空', details: { field: 'title' } } },
      400,
    )
    expect(err.code).toBe('invalid_input')
    expect(err.message).toBe('标题不能为空')
    expect(err.status).toBe(400)
    expect(err.details).toEqual({ field: 'title' })
    expect(err).toBeInstanceOf(Error)
  })

  it('toDisplayMessage 兜底', () => {
    expect(new ApiError({ code: 'network_error', message: '' }).toDisplayMessage()).toBe('请求失败，请稍后重试')
    expect(new ApiError({ code: 'x', message: '自定义' }).toDisplayMessage()).toBe('自定义')
  })
})
