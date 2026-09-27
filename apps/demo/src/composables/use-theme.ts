import { computed, ref } from 'vue'

/**
 * 双主题（默认亮色）
 *
 * 三态而不是两态：light / dark / auto。
 * 只做 light+dark 切换的后果是「用户手动切成暗色后，系统切回亮色时 App 不跟随」，
 * 这是移动端最常见的主题 bug。auto 是默认值，用户手动切过之后才固化。
 *
 * 本文件不引入任何 UI 依赖，只负责算出「此刻该用哪个主题」以及「组件库该用哪条色阶」，
 * 具体挂到 DOM 上由 DemoTheme.vue 完成。
 */
export type ThemeMode = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'cm_theme_mode'
/** 品牌色阶级数，与 tokens.css 的 --cm-brand-1..10 对齐 */
const BRAND_STEPS = 10

function readStoredMode(): ThemeMode {
  const stored = uni.getStorageSync(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto'
}

function readSystemTheme(): ResolvedTheme {
  const info = uni.getSystemInfoSync() as { theme?: string }
  if (info?.theme === 'dark')
    return 'dark'
  if (info?.theme === 'light')
    return 'light'
  // H5 端 systemInfo 不带 theme 字段，退回媒体查询
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  return 'light'
}

const mode = ref<ThemeMode>(readStoredMode())
const systemTheme = ref<ResolvedTheme>(readSystemTheme())
let listening = false

const isDark = computed(() => (mode.value === 'auto' ? systemTheme.value === 'dark' : mode.value === 'dark'))
const theme = computed<ResolvedTheme>(() => (isDark.value ? 'dark' : 'light'))

/**
 * 品牌色阶 → wot 主色变量（组件库靠它吃我们的品牌色）。
 *
 * 暗色下整条色阶反转（primary-1 ← brand-10 … primary-6 ← brand-5），
 * 与 wot 自带 dark.scss 同一策略：暗底上「最浅的一档」必须是最深的那个蓝，
 * 否则淡底色块会亮得刺眼；同时主色提亮一档，保证暗底上的可点击感。
 *
 * 用 var() 而不是写死色值的意义：暗色切换时组件库变量跟着 --cm-brand-* 一起变，
 * 组件库与业务页面永远同步，不存在「按钮变暗了、卡片还是亮的」。
 */
const themeVars = computed<Record<string, string>>(() => {
  const vars: Record<string, string> = {}
  for (let i = 1; i <= BRAND_STEPS; i++)
    vars[`primary${i}`] = `var(--cm-brand-${isDark.value ? BRAND_STEPS + 1 - i : i})`
  if (isDark.value) {
    // wot 暗色把 filled-oppo（卡面/浮层）给成纯黑 #000，比页面底 #1D1F29 还深，
    // 「卡片比底亮」的层次整个反掉（与 tokens.css 的黑洞覆盖同源问题）。
    // wd-card / wd-tabbar / wd-dialog 等 12+ 组件直接吃这个变量，仅改 --cm-bg-card 救不了它们，
    // 故在组件库注入点整体对齐到我们的卡片色（themeVars 内联在 provider 根上，
    // 恰好在 .wot-theme-dark 作用域内，var() 会解析到暗色值）。
    vars.filledOppo = 'var(--cm-bg-card)'
  }
  return vars
})

function setMode(next: ThemeMode) {
  mode.value = next
  uni.setStorageSync(STORAGE_KEY, next)
}

function toggleTheme() {
  setMode(isDark.value ? 'light' : 'dark')
}

function listenSystemTheme() {
  if (listening)
    return
  listening = true
  // onThemeChange 仅 App / 小程序可用（需 pages.json 开启 darkmode），H5 用媒体查询
  if (typeof uni.onThemeChange === 'function') {
    uni.onThemeChange((res: { theme?: string }) => {
      systemTheme.value = res?.theme === 'dark' ? 'dark' : 'light'
    })
    return
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
    })
  }
}

export function useTheme() {
  return { mode, theme, isDark, themeVars, setMode, toggleTheme, listenSystemTheme }
}
