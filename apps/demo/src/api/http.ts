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
 * 刷新令牌的裸请求器（不带 onUnauthorized，避免递归）。
 * 与主请求器复用同一 transport（uni.request），不在小程序端引入 fetch。
 */
const refreshHttp = createRequestor({ baseUrl: API_BASE_URL })

/** 单飞刷新令牌：并发 401 时只发一次刷新请求 */
const ensureFreshToken = createSessionRefresher(refreshToken =>
  refreshHttp.post<{ token: string, refreshToken?: string }>('/auth/refresh', { refreshToken }),
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
