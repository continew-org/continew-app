import type { SessionUser } from '@continew-app/core'
import { plainHttp } from './http'

/** 登录成功返回：令牌对 + 用户信息（与 packages/server 的 /auth 接口对齐） */
export interface LoginResult {
  token: string
  refreshToken?: string
  user: SessionUser
}

/** 账号密码登录：silent + 匿名请求器，错误（含密码错误的 401）由登录页自行处理 */
export function loginByAccount(username: string, password: string) {
  return plainHttp.post<LoginResult>('/auth/login', { username, password }, { silent: true })
}

/** 微信一键登录：code 由 uni.login({ provider: 'weixin' }) 获取 */
export function loginByWechat(code: string) {
  return plainHttp.post<LoginResult>('/auth/wechat', { code }, { silent: true })
}
