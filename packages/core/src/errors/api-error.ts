import type { CmApiErrorBody } from '../http/types'

/** 业务错误码约定：与 packages/server 的返回体对齐 */
export const API_ERROR_CODES = [
  'invalid_input',
  'unauthorized',
  'not_found',
  'conflict',
  'internal_error',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

export interface ApiErrorInit {
  code: ApiErrorCode | string
  message: string
  status?: number
  details?: unknown
}

/** 统一 API 错误：页面用 `err instanceof ApiError` 区分业务错误与网络错误 */
export class ApiError extends Error {
  readonly code: string
  readonly status?: number
  readonly details?: unknown

  constructor(init: ApiErrorInit) {
    super(init.message)
    this.name = 'ApiError'
    this.code = init.code
    this.status = init.status
    this.details = init.details
  }

  static fromBody(body: CmApiErrorBody, status?: number): ApiError {
    return new ApiError({
      code: body.error.code,
      message: body.error.message,
      status,
      details: body.error.details,
    })
  }

  /** 面向用户的可读文案（业务错误用 message，其余给兜底文案） */
  toDisplayMessage(): string {
    return this.message || '请求失败，请稍后重试'
  }
}
