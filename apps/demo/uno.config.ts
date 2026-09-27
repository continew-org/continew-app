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
 * ── 值的来源 ──
 * 本文件只放「名字」，值全部在 src/styles/tokens.css（Values → Names 分离）。
 * 加一个主题 = 在 tokens.css 里加一张映射表；本文件与业务代码一行都不用动。
 *
 * 语义色 shortcut 存在理由（勿删）：presetWot 配 prefix: 'wot' 后，令牌类名是「规则前缀 + 完整色键」，
 * 如主色文本要写 `text-wot-text-main`（双 text）、主色背景要写 `bg-wot-primary`——这个名字无法凭直觉猜中，
 * 写错（如 `text-color-main` / `bg-primary`）不会报错、不告警、构建全绿，但**生成零 CSS，样式静默失效**。
 * 故在此把常用语义色收敛成短名；新增语义色时先确认目标类能生成 CSS，再补进本清单。
 *
 * ── 排版系统（type-* 语义类）──
 * 字号 / 字重 / 行高 / 字体四件套收敛成 7 个类，业务不再手写 `text-sm font-semibold` 这类组合。
 * 分散写的必然结果：同一个「卡片标题」在不同页面长成 14/600、16/500、18/700 三种样子，全仓无一处相同。
 *
 * 字阶为什么是这 7 级（移动端 375pt）：
 * 低区 12→14→16 每级 2px 步进，高区 28→40 大跳。低于 2px 的步进人眼分辨不出，等于没有层级——
 * glow-trace 那套 10 级字阶（12/13/15/16/18/20）看着别扭，根源就是 12→13、15→16 只差 1px，
 * 六个级别实际只呈现两档，层级塌缩了。
 *
 * 字重的真实约束（三端独有，勿改）：
 * - 微信小程序不支持打包字体文件（loadFontFace 需网络地址 + 域名白名单），所以「全部 Inter」做不到，
 *   只能写成字体栈：优先 Inter，落不到就降系统字体。
 * - 中文没有 Inter 字形，实际渲染一定落到 PingFang SC / Noto Sans SC。中文字重 700 是系统合成加粗，
 *   小字号下会糊成一团——这是 glow-trace「禁 700」的真正来由。
 * - 但把大数字也一并禁掉是错的：≥28px 的拉丁数字没有 700 会显得虚胖、没有冲击力。
 *   结论：**700 只用于 type-display / type-display-lg（大数字），中文正文与标题用 400 / 500 / 600。**
 *
 * 用法：`class="type-title text-main"`——颜色需另配，type-* 只管字号字重行高（有色背景上写 text-white）。
 */
export default defineConfig({
  theme: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    },
    fontSize: {
      'caption': ['12px', '16px'],
      'body': ['14px', '22px'],
      'label': ['14px', '20px'],
      'title': ['16px', '24px'],
      'page-title': ['20px', '28px'],
      'display': ['28px', '34px'],
      'display-lg': ['40px', '46px'],
    },
    // 语义色：全部指向 tokens.css 的 --cm-* / 暗色下整组翻转，业务永远只写语义名
    colors: {
      cm: {
        'primary': 'var(--cm-primary)',
        'primary-hover': 'var(--cm-primary-hover)',
        'primary-active': 'var(--cm-primary-active)',
        'primary-soft': 'var(--cm-primary-soft)',
        'primary-soft-strong': 'var(--cm-primary-soft-strong)',
        'on-primary': 'var(--cm-on-primary)',
        'bg-page': 'var(--cm-bg-page)',
        'bg-card': 'var(--cm-bg-card)',
        'bg-sunken': 'var(--cm-bg-sunken)',
        'border': 'var(--cm-border)',
        'border-strong': 'var(--cm-border-strong)',
        'divider': 'var(--cm-divider)',
      },
    },
    // 海拔：暗色下 tokens.css 会换成纯黑高透明投影，类名不变
    boxShadow: {
      card: 'var(--cm-elevation-1)',
      pop: 'var(--cm-elevation-2)',
      float: 'var(--cm-elevation-3)',
      brand: 'var(--cm-elevation-brand)',
    },
    borderRadius: {
      card: 'var(--cm-radius-lg)',
      pill: 'var(--cm-radius-pill)',
    },
  },
  rules: [
    // 数字等宽：金额 / 统计数字必须开，否则逐位跳变时宽度抖动
    ['num', { 'font-variant-numeric': 'tabular-nums' }],
  ],
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

    // ── 自有语义色（替代 bg-white / bg-gray-200 这类硬编码）──
    // 出现 bg-white 意味着暗色模式下这张卡是全亮的，等于宣布双主题失败。
    ['bg-page', 'bg-cm-bg-page'],
    ['bg-card', 'bg-cm-bg-card'],
    ['bg-sunken', 'bg-cm-bg-sunken'],
    ['bg-brand', 'bg-cm-primary'],
    ['bg-brand-soft', 'bg-cm-primary-soft'],
    ['bg-brand-soft-strong', 'bg-cm-primary-soft-strong'],
    ['bg-on-brand', 'bg-cm-on-primary'],
    ['bg-divider', 'bg-cm-divider'],
    ['text-brand', 'text-cm-primary'],
    ['text-on-brand', 'text-cm-on-primary'],
    ['border-line', 'border-cm-border'],
    ['border-line-strong', 'border-cm-border-strong'],
    ['border-on-brand', 'border-cm-on-primary'],

    // 排版语义类：字号 + 字重 + 行高 + 字体一次给全（颜色另配 text-main / text-white）
    ['type-caption', 'text-caption font-medium font-sans'],
    ['type-body', 'text-body font-normal font-sans'],
    ['type-label', 'text-label font-medium font-sans'],
    ['type-title', 'text-title font-semibold font-sans'],
    ['type-page-title', 'text-page-title font-semibold font-sans'],
    ['type-display', 'text-display font-bold font-sans tracking-tight num'],
    ['type-display-lg', 'text-display-lg font-bold font-sans tracking-tight num'],
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
