#!/usr/bin/env node
/**
 * ContiNew App 红线扫描器（review-lint）。
 *
 * 扫描 ESLint 无法覆盖的工程红线：
 * - package.json 依赖版本是否写死（应统一用 catalog:）
 * - 是否引入第二家 UI 组件库（只用 wot-design-uni）
 * - .vue 文件 <style scoped> 行数是否超阈值（优先原子类）
 * - 是否在页面/组件中裸调 uni.request（应走 @continew-app/core）
 * - 是否写了硬编码中性色 / 色值（双主题下不会翻转，必须走语义类）
 * - tokens.css 中引用 wot 变量的语义 token 是否在暗色块重新声明（自定义属性按替换后的
 *   计算值继承，漏声明会导致暗色下该 token 冻结在亮色值——lint/typecheck/build 均发现不了）
 *
 * 用法：node tools/review-lint.mjs [--diff]（--diff 只扫描 git 暂存区，供 pre-commit 使用；
 * tokens.css 的主题检查始终全量执行——它是唯一值来源，一条规则守护整个机制）
 */
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const DIFF_MODE = process.argv.includes('--diff')
const SCOPED_STYLE_MAX_LINES = 50

const RED = '\x1B[31m'
const YELLOW = '\x1B[33m'
const RESET = '\x1B[0m'

const issues = []

function report(level, file, line, message) {
  issues.push({ level, file, line, message })
}

function getSourceFiles() {
  if (DIFF_MODE) {
    try {
      const out = execSync('git diff --cached --name-only --diff-filter=ACM', { cwd: ROOT, encoding: 'utf8' })
      return out.split('\n').filter(f => /\.(vue|ts|json)$/.test(f) && !f.includes('node_modules'))
    }
    catch {
      return []
    }
  }
  const files = []
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'unpackage' || entry === '.git')
        continue
      const full = join(dir, entry)
      if (statSync(full).isDirectory())
        walk(full)
      else if (/\.(vue|ts|json)$/.test(entry))
        files.push(full)
    }
  }
  walk(join(ROOT, 'apps'))
  walk(join(ROOT, 'packages'))
  return files
}

function scanPackageJson(file) {
  const content = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  // 跳过 eslint-config（peerDependencies 允许 catalog:，但 dependencies 里的 @antfu 必须 catalog:）
  for (const match of content.matchAll(/"([^"]+)":\s*"(\^|~|>=?)[^"]+"/g)) {
    const [, dep, range] = match
    if (dep === 'node' || dep === 'pnpm')
      continue
    report('error', rel, 0, `依赖 "${dep}" 写死了版本号（${range}...），请改为 "catalog:" 并在根 pnpm-workspace.yaml 的 catalog 中声明`)
  }
}

function scanVueFile(file) {
  const content = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)

  // 裸调 uni.request
  for (const match of content.matchAll(/uni\.request\s*\(/g)) {
    if (rel.includes('packages/core/src/http/'))
      continue // 白名单：请求层实现
    const line = content.slice(0, match.index).split('\n').length
    report('error', rel, line, '裸调 uni.request，请使用 @continew-app/core 的 createRequestor')
  }

  // 第二家 UI 组件库
  const bannedLibs = ['@nutui', 'uview-plus', 'uv-ui', 'sard-uniapp', 'tdesign-miniprogram', 'vant-weapp']
  for (const lib of bannedLibs) {
    if (content.includes(lib)) {
      report('error', rel, 0, `引入第二家 UI 组件库 "${lib}"，本项目只用 wot-design-uni + Cm* 薄壳`)
    }
  }

  // 硬编码中性色：双主题的杀手（红线 12）
  // bg-white / text-white / border-white / bg-gray-100 这类类名不随主题翻转，
  // 暗色模式下就是「一片全亮的卡片」。lint / typecheck / build 全都发现不了，只能靠扫类名。
  const HARDCODED_NEUTRAL = /(?:^|[\s"':])((?:bg|text|border|divide|from|via|to)-(?:white|black|(?:gray|slate|zinc|neutral|stone)-\d{2,3}))(?=[\s"':])/g
  for (const match of content.matchAll(HARDCODED_NEUTRAL)) {
    const line = content.slice(0, match.index).split('\n').length
    report('error', rel, line, `硬编码中性色 "${match[1]}"，暗色模式下不会翻转；请改用语义类：bg-card / bg-page / bg-sunken / bg-divider / bg-on-brand / text-main / text-secondary / text-on-brand / border-line`)
  }

  // 硬编码色值：bg-[#fff] / text-[#333] 同理，且绕过了 tokens.css 这唯一值来源
  for (const match of content.matchAll(/(?:bg|text|border)-\[#[0-9a-fA-F]{3,8}\]/g)) {
    const line = content.slice(0, match.index).split('\n').length
    report('error', rel, line, `硬编码色值 "${match[0]}"，请用语义类（值统一在 apps/demo/src/styles/tokens.css）`)
  }

  // <style scoped> 行数
  const styleBlocks = content.match(/<style[^>]*scoped[^>]*>([\s\S]*?)<\/style>/g) ?? []
  for (const block of styleBlocks) {
    const lines = block.split('\n').length - 2
    if (lines > SCOPED_STYLE_MAX_LINES) {
      report('warn', rel, 0, `<style scoped> 共 ${lines} 行（阈值 ${SCOPED_STYLE_MAX_LINES}），请优先使用原子类`)
    }
  }
}

/**
 * 主题 token 冻结检查：凡在亮色块引用 var(--wot-*) 的 --cm-* 语义 token，
 * 必须在 .wot-theme-dark 块重新声明。CSS 自定义属性按「替换完成后的计算值」继承，
 * 只在亮色作用域声明一次的引用会在亮色就冻结，暗色翻转 wot 变量救不回（lint/build 均不可见）。
 */
function scanThemeTokens() {
  const rel = 'apps/demo/src/styles/tokens.css'
  let css
  try {
    css = readFileSync(join(ROOT, rel), 'utf8')
  }
  catch {
    return // 使用者项目可能尚未引入 tokens.css，跳过
  }

  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({
    selector: m[1].trim(),
    body: m[2],
  }))
  const lightBody = blocks
    .filter(b => b.selector.includes(':root') || b.selector === 'page')
    .map(b => b.body)
    .join('\n')
  const darkBody = blocks.find(b => b.selector.includes('.wot-theme-dark'))?.body ?? ''

  const refsWot = [...lightBody.matchAll(/(--cm-[\w-]+)\s*:[^;]*var\(--wot-[^;]*;/g)].map(m => m[1])
  const darkDeclared = new Set([...darkBody.matchAll(/(--cm-[\w-]+)\s*:/g)].map(m => m[1]))
  const missing = [...new Set(refsWot)].filter(name => !darkDeclared.has(name))
  if (missing.length > 0) {
    report('error', rel, 0, `暗色主题变量冻结：${missing.join('、')} 在亮色块引用了 var(--wot-*) 但未在 .wot-theme-dark 重新声明——暗色下将冻结在亮色值；请在暗色块重新声明（var(--wot-*) 引用或显式暗色值均可）`)
  }
}

function main() {
  scanThemeTokens()

  const files = getSourceFiles()
  if (files.length === 0) {
    console.log('[review-lint] 无待扫描文件')
    return
  }

  for (const file of files) {
    const full = file.startsWith(ROOT) ? file : join(ROOT, file)
    if (file.endsWith('package.json'))
      scanPackageJson(full)
    else if (file.endsWith('.vue'))
      scanVueFile(full)
  }

  const errors = issues.filter(i => i.level === 'error')
  const warnings = issues.filter(i => i.level === 'warn')

  for (const { level, file, line, message } of issues) {
    const color = level === 'error' ? RED : YELLOW
    console.log(`${color}[${level.toUpperCase()}]${RESET} ${file}${line ? `:${line}` : ''}  ${message}`)
  }

  console.log(`\n[review-lint] 扫描 ${files.length} 个文件：${errors.length} 个错误，${warnings.length} 个警告`)
  if (errors.length > 0)
    process.exit(1)
}

main()
