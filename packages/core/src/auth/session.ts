export const TOKEN_STORAGE_KEY = 'cm_token'
export const REFRESH_TOKEN_STORAGE_KEY = 'cm_refresh_token'
export const USER_INFO_STORAGE_KEY = 'cm_user_info'

/** 会话状态机：valid（可用）/ expired（过期，可尝试刷新）/ unavailable（不可用，需重新登录） */
export type SessionStatus = 'valid' | 'expired' | 'unavailable'

export interface SessionUser {
  id: string
  nickname?: string
  avatar?: string
  [key: string]: unknown
}

export interface TokenPair {
  token: string
  refreshToken?: string
}

export function getToken(): string | undefined {
  return uni.getStorageSync(TOKEN_STORAGE_KEY) || undefined
}

export function getRefreshToken(): string | undefined {
  return uni.getStorageSync(REFRESH_TOKEN_STORAGE_KEY) || undefined
}

export function setTokens({ token, refreshToken }: TokenPair): void {
  uni.setStorageSync(TOKEN_STORAGE_KEY, token)
  if (refreshToken !== undefined) {
    uni.setStorageSync(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
  }
}

export function clearSession(): void {
  uni.removeStorageSync(TOKEN_STORAGE_KEY)
  uni.removeStorageSync(REFRESH_TOKEN_STORAGE_KEY)
  uni.removeStorageSync(USER_INFO_STORAGE_KEY)
}

export function getStoredUser<T extends SessionUser = SessionUser>(): T | undefined {
  const raw = uni.getStorageSync(USER_INFO_STORAGE_KEY)
  return (raw || undefined) as T | undefined
}

export function setStoredUser(user: SessionUser): void {
  uni.setStorageSync(USER_INFO_STORAGE_KEY, user)
}

/**
 * 单飞刷新令牌：并发触发时只发一次刷新请求，其余排队等结果。
 * 避免「多个并发请求同时 401 → 同时刷新 → 后一个把前一个的 token 顶掉」。
 */
export function createSessionRefresher(refresh: (refreshToken: string) => Promise<TokenPair>) {
  let refreshing: Promise<TokenPair> | null = null

  return async function ensureFreshToken(): Promise<string | undefined> {
    const current = getToken()
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return current
    }
    refreshing ??= refresh(refreshToken)
      .then((pair) => {
        setTokens(pair)
        return pair
      })
      .finally(() => {
        refreshing = null
      })
    try {
      const pair = await refreshing
      return pair.token
    }
    catch {
      clearSession()
      return undefined
    }
  }
}
