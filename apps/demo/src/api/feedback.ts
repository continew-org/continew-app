import { createGlobalFeedback } from '@continew-app/core'

/**
 * 全局 toast/loading 反馈实例（AGENTS.md 红线：toast 统一走 core 封装，不裸调 uni.showToast）。
 * 业务页面只引用本实例，便于后续平滑替换为 wd-toast / 自定义实现。
 */
export const feedback = createGlobalFeedback()
