/** 服务端统一返回体形状（与 packages/server 对齐） */
export interface CmApiErrorBody {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export interface RequestOptions {
  /** 基础地址，如 import.meta.env.VITE_API_BASE_URL */
  baseUrl: string
  /** 获取访问令牌（每次请求调用，支持异步） */
  getToken?: () => string | undefined | Promise<string | undefined>
  /** 业务错误是否默认 toast 提示，默认 true */
  toastOnError?: boolean
  /** 自定义错误提示（默认使用 uni.showToast） */
  onErrorToast?: (message: string) => void
  /**
   * 401 处理：返回 true 表示已恢复（如单飞刷新令牌成功），原请求自动重试一次；
   * 返回 false/undefined 则按未认证处理（通常会话已失效，需重新登录）
   */
  onUnauthorized?: () => Promise<boolean>
}

/** uni.request 支持的 HTTP 方法（小程序平台暂不支持 PATCH，见 request.ts 注释） */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'

/** 应用层方法：PATCH 在小程序端由 request.ts 自动降级为 POST + X-HTTP-Method-Override */
export type AppHttpMethod = HttpMethod | 'PATCH'

export interface RequestConfig {
  method?: AppHttpMethod
  /** query 参数，自动拼到 URL */
  query?: Record<string, string | number | boolean | undefined>
  /** 请求体（JSON） */
  body?: unknown
  /** 额外请求头 */
  header?: Record<string, string>
  /** 本次请求跳过默认错误提示 */
  silent?: boolean
}

export interface Requestor {
  request: <T>(path: string, config?: RequestConfig) => Promise<T>
  get: <T>(path: string, query?: RequestConfig['query'], config?: Omit<RequestConfig, 'method' | 'query'>) => Promise<T>
  post: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) => Promise<T>
  put: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) => Promise<T>
  patch: <T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) => Promise<T>
  del: <T>(path: string, config?: Omit<RequestConfig, 'method'>) => Promise<T>
}
