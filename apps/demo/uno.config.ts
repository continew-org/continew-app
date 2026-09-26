import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetRemToPx } from '@unocss/preset-rem-to-px'
import { presetWot } from '@wot-ui/unocss-preset'
import { defineConfig } from 'unocss'

/**
 * UnoCSS 组合：
 * - presetUni：uni-app 基础原子类（内置 wind3 + attributify + 平台适配），关闭 remRpx 由 presetRemToPx 接管
 * - presetRemToPx：把 wind 工具类的 rem 转成固定 px（baseFontSize 16），避免 uni-h5 根字号缩放导致布局失真
 * - presetWot：wot-* 设计令牌（品牌语义色、间距、圆角），与 wot-design-uni 组件对齐
 *
 * 单位策略：统一用固定 px（px-4 = 16px），不用 rem/rpx——三端一致，且不随屏幕宽度缩放（多端标准做法）。
 *
 * 语义色 shortcut 存在理由（勿删）：presetWot 配 prefix: 'wot' 后，令牌类名是「规则前缀 + 完整色键」，
 * 如主色文本要写 `text-wot-text-main`（双 text）、主色背景要写 `bg-wot-primary`——这个名字无法凭直觉猜中，
 * 写错（如 `text-color-main` / `bg-primary`）不会报错、不告警、构建全绿，但**生成零 CSS，样式静默失效**。
 * 故在此把常用语义色收敛成短名；新增语义色时先确认目标类能生成 CSS，再补进本清单。
 */
export default defineConfig({
  shortcuts: [
    // 语义文本色 → wot 文本令牌
    ['text-main', 'text-wot-text-main'],
    ['text-secondary', 'text-wot-text-secondary'],
    ['text-auxiliary', 'text-wot-text-auxiliary'],
    ['text-placeholder', 'text-wot-text-placeholder'],
    ['text-disabled', 'text-wot-text-disabled'],
    // 语义前景色 / 背景色 → wot 品牌色令牌
    ['text-primary', 'text-wot-primary'],
    ['text-danger', 'text-wot-danger'],
    ['text-success', 'text-wot-success'],
    ['text-warning', 'text-wot-warning'],
    ['bg-primary', 'bg-wot-primary'],
    ['bg-danger', 'bg-wot-danger'],
    ['bg-success', 'bg-wot-success'],
    ['bg-warning', 'bg-wot-warning'],
    ['bg-filled-content', 'bg-wot-filled-content'],
  ],
  presets: [
    presetUni({
      remRpx: false,
    }),
    presetRemToPx(),
    presetWot({
      prefix: 'wot',
      preflight: true,
      baseTokens: false,
    }),
  ],
})
