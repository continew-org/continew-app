/**
 * 安全返回上一页：H5 刷新后 delta=0 时 uni.navigateBack 会失效，
 * 用兜底路由保证用户总能回到一个语义化的父级页面。
 *
 * 红线（AGENTS.md）：不裸调 uni.navigateBack()。
 */
export function safeBack(fallbackUrl: string, options: { delta?: number } = {}): void {
  const { delta = 1 } = options
  const pages = getCurrentPages()
  if (pages.length > delta) {
    uni.navigateBack({ delta })
  }
  else {
    uni.reLaunch({ url: fallbackUrl })
  }
}

/** 从当前页面路由参数中取值（兼容 query 与 @wot-ui/router 落 query 的场景） */
export function pickRouteParam(key: string): string | undefined {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const options = (current as { options?: Record<string, string> } | undefined)?.options
  const value = options?.[key]
  return value === '' ? undefined : value
}

/** 跳转到登录页，并携带回跳地址 */
export function toLoginPage(loginUrl = '/pages/login/index'): void {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const currentRoute = current ? `/${current.route}` : ''
  const redirect = currentRoute && !currentRoute.startsWith(loginUrl)
    ? `?redirect=${encodeURIComponent(currentRoute)}`
    : ''
  uni.reLaunch({ url: `${loginUrl}${redirect}` })
}
