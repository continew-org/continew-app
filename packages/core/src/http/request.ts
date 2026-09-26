import type { CmApiErrorBody, RequestConfig, RequestOptions, Requestor } from './types'
import { ApiError } from '../errors/api-error'

function buildUrl(baseUrl: string, path: string, query?: RequestConfig['query']): string {
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
  if (!query)
    return url
  const params = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  return params.length > 0 ? `${url}?${params.join('&')}` : url
}

function isApiErrorBody(data: unknown): data is CmApiErrorBody {
  return (
    typeof data === 'object'
    && data !== null
    && 'error' in data
    && typeof (data as { error?: unknown }).error === 'object'
  )
}

/**
 * 创建统一请求器（三端通用，底层走 uni.request）。
 *
 * 红线（AGENTS.md）：页面与 composable 一律通过它发请求，不裸调 uni.request。
 */
export function createRequestor(options: RequestOptions): Requestor {
  const { baseUrl, getToken, toastOnError = true, onErrorToast, onUnauthorized } = options

  const showErrorToast = (message: string) => {
    if (onErrorToast) {
      onErrorToast(message)
    }
    else {
      uni.showToast({ title: message, icon: 'none', duration: 2500 })
    }
  }

  async function rawRequest<T>(path: string, config: RequestConfig): Promise<T> {
    const { method = 'GET', query, body, header = {}, silent = false } = config
    const token = await getToken?.()
    const finalHeader: Record<string, string> = {
      'Content-Type': 'application/json',
      ...header,
    }
    if (token) {
      finalHeader.Authorization = `Bearer ${token}`
    }

    // 小程序平台 uni.request 不支持 PATCH：降级为 POST + X-HTTP-Method-Override（业界通行做法）
    const isPatch = method === 'PATCH'
    const finalMethod = isPatch ? 'POST' : method
    if (isPatch) {
      finalHeader['X-HTTP-Method-Override'] = 'PATCH'
    }

    return new Promise<T>((resolve, reject) => {
      uni.request({
        url: buildUrl(baseUrl, path, query),
        method: finalMethod,
        data: body as Record<string, unknown> | undefined,
        header: finalHeader,
        success: (res) => {
          const { statusCode, data } = res
          if (statusCode >= 200 && statusCode < 300) {
            resolve(data as T)
            return
          }
          const apiError = isApiErrorBody(data)
            ? ApiError.fromBody(data, statusCode)
            : new ApiError({ code: 'http_error', message: `请求失败（${statusCode}）`, status: statusCode })
          if (!silent && toastOnError && statusCode !== 401) {
            showErrorToast(apiError.toDisplayMessage())
          }
          reject(apiError)
        },
        fail: (err) => {
          const networkError = new ApiError({
            code: 'network_error',
            message: err.errMsg || '网络异常，请检查网络连接',
          })
          if (!silent && toastOnError) {
            showErrorToast(networkError.toDisplayMessage())
          }
          reject(networkError)
        },
      })
    })
  }

  async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    try {
      return await rawRequest<T>(path, config)
    }
    catch (err) {
      // 401 且有恢复钩子：尝试恢复（如单飞刷新令牌）并重试一次
      if (err instanceof ApiError && err.status === 401 && onUnauthorized) {
        const recovered = await onUnauthorized()
        if (recovered) {
          return rawRequest<T>(path, config)
        }
      }
      throw err
    }
  }

  return {
    request,
    get: <T>(path: string, query?: RequestConfig['query'], config: Omit<RequestConfig, 'method' | 'query'> = {}) =>
      request<T>(path, { ...config, method: 'GET', query }),
    post: <T>(path: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) =>
      request<T>(path, { ...config, method: 'POST', body }),
    put: <T>(path: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) =>
      request<T>(path, { ...config, method: 'PUT', body }),
    patch: <T>(path: string, body?: unknown, config: Omit<RequestConfig, 'method' | 'body'> = {}) =>
      request<T>(path, { ...config, method: 'PATCH', body }),
    del: <T>(path: string, config: Omit<RequestConfig, 'method'> = {}) =>
      request<T>(path, { ...config, method: 'DELETE' }),
  }
}
