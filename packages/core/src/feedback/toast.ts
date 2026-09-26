export type ToastType = 'success' | 'error' | 'loading' | 'none'

export interface GlobalFeedbackOptions {
  /** 加载提示的防抖延迟（毫秒），避免闪屏，默认 300 */
  loadingDelay?: number
}

/** 统一 toast 封装：后续可平滑替换为 wd-toast / 自定义实现 */
export function createGlobalFeedback(_options: GlobalFeedbackOptions = {}) {
  const toast = {
    show(title: string, type: ToastType = 'none', duration = 2000) {
      if (type === 'loading') {
        uni.showLoading({ title, mask: true })
        return
      }
      const icon = type === 'success' ? 'success' : type === 'error' ? 'error' : 'none'
      uni.showToast({ title, icon: icon as 'success' | 'error' | 'none', duration })
    },
    success(title: string) {
      toast.show(title, 'success')
    },
    error(title: string) {
      toast.show(title, 'error')
    },
    loading(title = '加载中…') {
      toast.show(title, 'loading')
    },
    hide() {
      uni.hideLoading()
      uni.hideToast()
    },
  }
  return toast
}

export type GlobalFeedback = ReturnType<typeof createGlobalFeedback>
