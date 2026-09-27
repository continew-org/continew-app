import {
  clearSession,
  createRequestor,
  createSessionRefresher,
  getRefreshToken,
  getToken,
  toLoginPage,
} from '@continew-app/core'
import { API_BASE_URL } from '../config'

/**
 * 匿名请求器：登录 / 刷新令牌等「认证前置」请求专用。
 * 不带 onUnauthorized——这些接口自身返回的 401（如密码错误）不应触发会话恢复链路。
 */
export const plainHttp = createRequestor({ baseUrl: API_BASE_URL })

/** 单飞刷新令牌：并发 401 时只发一次刷新请求 */
const ensureFreshToken = createSessionRefresher(refreshToken =>
  plainHttp.post<{ token: string, refreshToken?: string }>('/auth/refresh', { refreshToken }),
)

/** 统一请求器实例：页面与 composable 一律经它访问后端（AGENTS.md 红线） */
export const http = createRequestor({
  baseUrl: API_BASE_URL,
  getToken,
  onUnauthorized: async () => {
    if (!getRefreshToken()) {
      clearSession()
      toLoginPage()
      return false
    }
    const token = await ensureFreshToken()
    if (!token) {
      toLoginPage()
      return false
    }
    return true
  },
})
