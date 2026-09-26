export interface ConfirmDeleteOptions {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
}

/**
 * 统一删除确认：所有删除走同一弹窗，不裸调 uni.showModal（AGENTS.md 红线）。
 * 返回 Promise<boolean>：true 表示用户确认。
 */
export function confirmDelete(options: ConfirmDeleteOptions = {}): Promise<boolean> {
  const {
    title = '确认删除',
    content = '删除后不可恢复，确定要删除吗？',
    confirmText = '删除',
    cancelText = '取消',
  } = options

  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      confirmColor: '#f14646',
      success: res => resolve(res.confirm),
      fail: () => resolve(false),
    })
  })
}
