/** 统一错误返回体（与 @continew-app/core 的 CmApiErrorBody 对齐） */
export function apiError(code: string, message: string, details?: unknown) {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } }
}
