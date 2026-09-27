# AGENTS.md

本文件为在本代码库中工作的 AI 编程智能体（DeepSeek Harness、Claude Code、Codex、Cursor、ZCode 等）提供指引。面向人类贡献者的说明请查阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## AI 贡献准则

- **不得以 AI 身份在 Issue 或 PR 上发表评论**。讨论区只属于人类。
- **先讨论再实现**：非平凡改动（如新功能、重构）开工前，先在 Issue 评论中与维护者就实现方向达成一致。
- **新增依赖须先行讨论**：引入任何第三方依赖前，必须在 Issue 中说明用途、体积与维护活跃度，与维护者达成一致后再动手；运行时依赖优先使用已有依赖覆盖，禁止为单一小功能引入重量级库。
- **依赖版本集中管理**：所有依赖版本统一在根目录 `pnpm-workspace.yaml` 的 `catalog` 中声明，各 package.json 一律写 `catalog:`；内部包依赖统一写 `workspace:*`。
- **披露 AI 使用**：当提交中较大部分由 AI 生成时，请在 commit message 末尾追加 trailer，注明实际使用的智能体，例如：

  ```
  Assisted-by: ZCode
  ```
- 贡献流程遵循 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 项目概述

ContiNew App 是 OpenContiNew 社区的多端工程脚手架，目标平台 **App（Android/iOS）、微信小程序、H5、桌面端（Tauri，规划中）** 多端一套代码。差异化定位在工程治理与 AI 协作，而非组件库本身。

**技术栈**：uni-app（Vue 3.5 + Vite 5 + TypeScript strict）+ wot-design-uni + UnoCSS + Pinia + Hono（演示后端）

**当前版本**：0.1.0 | **主分支**：`dev` | **Node**：22+ | **包管理**：pnpm 12（`packageManager` 字段锁定，`corepack enable` 启用，勿用 npm/yarn）

### 技术栈决策

以下决策已经过充分调研，改动需先开 Issue 讨论：

- **经典 uni-app（Vue 3），不选 uni-app x**：wot-design-uni / uv-ui / TDesign 均不支持 uni-app x，其组件生态远未成熟；且 uts 是 AI 训练语料极少的新语言，与「AI 协作友好」目标冲突。经典 uni-app 的微信小程序 / H5 端持续维护，App 端（webview 渲染）对 CRUD 类应用性能足够。
- **Vite 锁死 5.2.8，不追新**：`@dcloudio/vite-plugin-uni` 的 peerDependencies 明确锁死 `vite: 5.2.8`，升 Vite 6/7 会导致 uni-app 编译失败（编译器深度依赖 Vite 5 内部 API）。等官方支持后再升，catalog 改一行即可。
- **wot-design-uni，不选 TDesign / Sard Uniapp**：TDesign 没有 uni-app 三端方案（`tdesign-miniprogram` 仅微信小程序，`tdesign-mobile-vue` 无法编译到小程序）；Sard 在实战中被验证 AI 调用体验差（大量 `:deep()` 穿透）。wot-design-uni 是目前 uni-app 三端唯一现实选择；`Cm*` 薄壳层是其可替换性的保险。
- **UnoCSS 组合 presetUni + presetRemToPx + presetWot**：`presetUni`（内置 wind3）提供 Tailwind 兼容语法（AI 训练语料最丰富），`presetRemToPx` 把 wind 工具类的 rem 转成固定 px（避免 uni-h5 根字号缩放失真），`presetWot` 提供 `wot-*` 设计令牌（与组件库对齐）。单位策略：统一固定 px（`px-4` = 16px），不用 rem/rpx。详见 `apps/demo/uno.config.ts` 头注释。
- **本期只做 App / 微信小程序 / H5 三端，桌面端未启动**：README 将桌面端（Tauri）列为规划方向，但当前代码库不含任何桌面端支持。**本期一律按三端处理，不写 Tauri 适配代码、不为桌面端加条件编译**；真启动时先开 Issue 讨论。
- **小程序特殊类名转义未专门保障**：已移除 `presetApplet`，`w-1/2`（含 `/`）、`[&>view]:xxx`（任意选择器）、`dark:` 等含特殊字符的类名在小程序端可能因转义失效。当前未用到故未触发；**遇到时优先考虑用等价的普通类名重写**（如 `w-1/2` → `w-50%` 不支持则改固定 px），不要轻易重新引入 presetApplet。

## 核心架构

### Monorepo 结构（pnpm workspace）

```
apps/
  demo/                    # 演示应用（App / 微信小程序 / H5）
packages/
  core/                    # 核心运行时：请求层 / 会话管理 / 组合式函数
  ui/                      # Cm* 薄壳组件（基于 wot-design-uni）
  server/                  # 独立演示后端（Hono + Zod）
  eslint-config/           # 统一 ESLint 配置（@antfu/eslint-config 二次定制）
tools/                     # 工程化工具（review-lint 红线扫描器）
```

### 各包职责与边界

| 包 | 职责 | 关键约定 |
|:---|:-----|:-----|
| `@continew-app/core` | 请求层 / 会话管理 / 组合式函数 | 无 UI 依赖，可在任何 uni-app 项目中使用 |
| `@continew-app/ui` | Cm* 薄壳组件 | 只封装 wot-design-uni，不依赖 core，不引入第二家组件库 |
| `@continew-app/server` | 独立演示后端 | 不依赖 ContiNew Admin，独立发展；与 core 共享返回体形状 |
| `@continew-app/eslint-config` | 统一 ESLint 配置 | 唯一事实源，内置红线规则（no-restricted-*），各包不单独维护 .eslintrc |
| `@continew-app/demo` | 演示应用 | **AI 的唯一规范载体**：新增页面/组件照它的结构写 |

> **为什么 demo 是唯一规范载体，而不是 SKILL.md**：demo 被 lint / redline / typecheck / build 四道门禁跑着，写错了 CI 当场红；SKILL.md 里写错了没有任何东西会告诉你——半年后它就开始教 AI 过时的写法。脚手架维护者只有一个人，多一份文档化规范就多一份漂移面。因此本项目**不内置 `.agents/skills`**：红线拦错误写法，demo 展示正确写法，两者配合即闭环。新增页面照 `apps/demo` 的结构写（建 `.vue` → 注册 `pages.json` → `useList` + `CmPage` 三态 → `api/` 建模块）。

### 关键机制

- **统一请求层**：`@continew-app/core` 的 `createRequestor()` 返回 `{ get, post, put, patch, del, request }`，内置 token 注入、业务错误归一化（`ApiError`）、错误 toast、401 恢复钩子（`onUnauthorized`）。页面与 composable 一律经它发请求，**不裸调 `uni.request`**。
- **会话管理**：`createSessionRefresher()` 提供单飞刷新令牌（并发 401 只刷新一次）；`clearSession()` 统一登出；`safeBack()` 兜底返回（H5 刷新 delta=0 时 `uni.navigateBack` 失效）。**不裸调 `uni.navigateBack`**。
- **列表三态**：`useList()` + `<CmPage>` 组件强制「加载 / 错误 / 空」三态，缺一不可。
- **统一返回体**：`packages/server` 与 `@continew-app/core` 共享 `{ error: { code, message, details? } }` 错误形状；HTTP 语义约定：`400` 入参非法（`invalid_input`）、`401` 会话失效、`404` 资源不存在、`409` 状态冲突。
- **Cm* 薄壳组件**：`@continew-app/ui` 提供 `<CmPage>` `<CmEmpty>` 等薄壳，内部包装 `wd-*`。业务页面优先使用 Cm*，确需 wd-* 时直接使用，但**不写 `:deep()` 穿透组件内部样式**（应提 Issue 到组件库或提 PR 扩展 Cm*）。
- **原子类**：模板优先使用 Tailwind 语法原子类（`px-4` `text-sm` `flex` 等，AI 语料最丰富）；需要品牌语义色时用 `wot-*` 令牌类；**不手写大量 scoped SCSS**。
- **设计令牌三层结构（值 / 名 / 主题分离）**：
  - **值**在 `apps/demo/src/styles/tokens.css`：原始层（`--cm-brand-1..10` 品牌色阶）+ 语义层（`--cm-primary` / `--cm-bg-card` / `--cm-elevation-*` 等）。中性色**不自建色阶**，直接指向 wot 语义变量（`--wot-filled-*` / `--wot-text-*` / `--wot-border-*`），白拿它的暗色翻转。
  - **名**在 `apps/demo/uno.config.ts`：语义类短名（`bg-card` / `text-main` / `type-title` / `shadow-card`）。**新增 token 前必须先用 `createGenerator` 验证目标类能生成 CSS**（写错不报错、不告警、构建全绿，但生成零 CSS，样式静默失效）。
  - **主题**只改「语义层 → 原始层」的映射（`.wot-theme-dark` 块）。加一个主题 = 加一张映射表，业务与配置一行都不用动。
- **双主题（默认亮色）**：`useTheme()` 提供 light / dark / **auto 三态**（默认跟随系统，用户手动切过才固化并持久化）；主题由页面根组件 `<DemoTheme>` 挂载（`wd-config-provider` + `min-h-screen bg-page`）。
  - **为什么不放 App.vue**：小程序端每个页面是独立 Page，App.vue 的模板不会渲染进页面，包在那里只有 H5 生效——三端里只有一端生效的 bug 最难发现。
  - 业务代码**只引用语义类**，中性色一律用 `bg-card` / `bg-page` / `bg-sunken` / `bg-divider` / `border-line`；品牌底上的前景用 `*-on-brand`。**出现 `bg-white` 即等于宣布双主题失败**（红线 12 拦截）。

## 构建与运行命令

```bash
# 安装依赖（首次）
pnpm install

# 演示应用（H5，默认端口 5173，/api 代理到 8080）
pnpm dev:demo

# 演示后端（默认端口 8080）
pnpm dev:server

# 微信小程序（编译后导入微信开发者工具）
pnpm dev:mp-weixin

# App（编译后导入 HBuilderX 真机运行）
pnpm dev:app

# 类型检查（vue-tsc / tsc 全量）
pnpm typecheck

# ESLint 检查 / 自动修复
pnpm lint
pnpm lint:fix

# 红线扫描（ESLint 覆盖之外的工程红线）
pnpm lint:redline

# 单元测试（Vitest）
pnpm test

# 三端生产构建（server + H5 + 微信小程序）
pnpm build

# 完整门禁（lint + lint:redline + typecheck + build）
pnpm verify

# 快速门禁（lint + lint:redline + typecheck）
pnpm verify:quick
```

### 提交前门禁（必须通过）

提交代码前，AI 智能体**必须**让门禁通过：

1. `pnpm lint`——ESLint 代码规范检查（含红线规则）；
2. `pnpm lint:redline`——review-lint 红线扫描（依赖版本、第二家 UI 库、裸调 uni.request、scoped 样式行数）；
3. `pnpm typecheck`——vue-tsc / tsc 全量类型检查；
4. `pnpm build`——三端生产构建（server + H5 + 微信小程序，验证可构建性）。

被 lint 拦截时执行 `pnpm lint:fix` 自动修复，再重跑 `pnpm lint` 确认。全部门禁通过后才能提交。紧急跳过用 `git commit --no-verify`，事后必须补跑。

## 代码红线（违反即返工）

以下规则是骨架稳定性的底线。**其中大部分已由 ESLint 规则与 review-lint 扫描器机器化拦截**（见下表），AI 仍须主动遵守未被机器覆盖的部分：

| # | 红线 | 机器拦截情况 |
|:--|:-----|:------------|
| 1 | **不裸调 `uni.request`**：一律走 `@continew-app/core` 的请求器 | review-lint 扫描（白名单：`packages/core/src/http/`） |
| 2 | **不裸调 `uni.navigateBack`**：一律走 `safeBack()` 兜底 | ESLint `no-restricted-properties` |
| 3 | **不裸调 `uni.showModal` 做删除确认**：一律走 `confirmDelete()` | ESLint `no-restricted-properties` |
| 4 | **列表页必须有加载 / 错误 / 空三态**：用 `useList()` + `<CmPage>`，不手写 | 暂无机器拦截，AI 主动遵守 |
| 5 | **不引入第二家 UI 组件库**：只用 wot-design-uni + Cm* 薄壳 | review-lint 扫描 |
| 6 | **不写 `:deep()` 穿透 wd-* 内部样式**：确有需要时提 Issue 到组件库或扩展 Cm*；确需自定义样式时放 `apps/demo/src/styles/*.css` 作全局 CSS 引入，不在 SFC 里开 style 块 | ESLint `vue/no-restricted-block`（禁 style 块，`:deep()` 无处可写）|
| 7 | **不手写大量 scoped SCSS**：优先原子类（Tailwind 语法）；语义色用 `uno.config.ts` 里的 shortcut 短名（`text-main` / `bg-primary`），**不手拼 `wot-*` 令牌类名**（拼错会生成零 CSS，静默失效） | ESLint `vue/no-restricted-block`（禁 style 块）+ `vue/max-lines-per-block`（限行数） |
| 8 | **不在组件内写业务计算**：纯计算抽到 core 的组合式函数或独立工具 | ESLint `vue/max-lines-per-block`（script ≤300 行） |
| 9 | **依赖版本只改 `pnpm-workspace.yaml` 的 catalog**：package.json 一律写 `catalog:` | review-lint 扫描 |
| 10 | **新增环境变量必须同步进 `.env.example`** | 暂无机器拦截，AI 主动遵守 |
| 11 | **不裸调 `uni.showToast` / `showLoading` / `hideToast` / `hideLoading`**：toast 与 loading 一律走 `createGlobalFeedback()` 创建的实例（demo 中为 `apps/demo/src/api/feedback.ts`） | ESLint `no-restricted-properties`（白名单：`packages/core/src/**`） |
| 12 | **不写硬编码中性色 / 色值**：`bg-white` / `text-white` / `border-white` / `bg-gray-100` / `bg-[#fff]` 在暗色模式下不会翻转，一律用语义类（`bg-card` / `bg-page` / `bg-sunken` / `bg-divider` / `bg-on-brand` / `text-main` / `text-secondary` / `text-on-brand` / `border-line`） | review-lint 扫描 |

## 常见任务

- **新增一个演示页面**：在 `apps/demo/src/pages/<name>/index.vue` 创建，注册到 `pages.json`，使用 `<CmPage>` 组织三态；如涉及新 API，先在 `apps/demo/src/api/` 建立对应模块。
- **新增一个 Cm* 组件**：在 `packages/ui/src/components/cm-<name>/Cm<Name>.vue` 创建，导出到 `packages/ui/src/index.ts`；只包装 `wd-*`，不依赖 core，不引入其他组件库。
- **新增一个组合式函数**：在 `packages/core/src/composables/use-<name>.ts` 创建，导出到 `packages/core/src/index.ts`；保持无 UI 依赖。
- **新增一个后端接口**：在 `packages/server/src/routes/` 建立路由文件，挂载到 `src/app.ts`；入参走 Zod 校验，错误返回统一 `apiError(code, message, details?)` 形状。
- **升级依赖**：先开 Issue 讨论（说明用途、体积、维护活跃度），通过后只改 `pnpm-workspace.yaml` 的 `catalog`，各包自动生效。

## 已知约束与取舍

以下「踩坑式修复」写入此处，避免半年后无人能解释：

- **pinia 3 devtools alias stub**：pinia 3 静态 import `@vue/devtools-api`（完整实现由浏览器 Vue DevTools 扩展运行时注入），在 uni-app 三端构建中 alias 到 `apps/demo/src/stubs/devtools.ts` 空实现。**不能改用 `build.rollupOptions.external`**（产物会残留裸 import，浏览器无 importmap 会直接报错）。
- **小程序 PATCH 降级**：微信小程序 `uni.request` 不支持 PATCH 方法，请求层自动降级为 `POST + X-HTTP-Method-Override: PATCH`（业界通行做法），业务代码无感知。
- **UnoCSS 语义色 shortcut（勿删）**：presetWot 配 `prefix: 'wot'` 后，令牌类名 = 规则前缀 + 完整色键（主色文本是 `text-wot-text-main`、主色背景是 `bg-wot-primary`）。这个名字无法凭直觉猜中，写错（如 `text-color-main` / `bg-primary`）**不报错、不告警、构建全绿，但生成零 CSS，样式静默失效**——lint / typecheck / build 全都发现不了。故在 `apps/demo/uno.config.ts` 的 `shortcuts` 中收敛为短名（`text-main` / `text-secondary` / `bg-primary` 等）；**新增语义色前，先用 unocss `createGenerator` 验证目标类确实能生成 CSS，再补进 shortcuts**。
- **wot v2 图标名与 cell 图标 prop（同类静默坑）**：图标名以 `@wot-ui/ui/components/wd-icon/iconfont.scss` 的类清单为准——v2 砍掉了 `lock-on` / `magic` / `palette` / `view-module` / `warning` / `setting` 等 v1 名，写错**不报错、只是渲染空白**；`wd-cell` 的图标 prop 在 v2 改名 `prefix-icon`（v1 的 `icon=` 被静默忽略）。cell / tabbar 等组件密度（内边距、字号、高度）统一在 `use-theme.ts` 的 `themeVars` 调，不要在页面里写样式覆盖。
- **H5 端 `tabBar.custom` 不生效**：uni-app 的自定义 tabbar 仅微信小程序支持，H5 / App 端原生 tabbar 照常渲染（白底、无图标、pages.json 静态色），会压在 `wd-tabbar` 上——`pages.json` 已设 `height: "0"`、`DemoTabBar` 挂载时 `uni.hideTabBar()`，两重保险**勿删**；原生导航栏颜色由 `DemoTheme` 随应用内主题同步（`theme.json` 的 darkmode 只跟随系统，不跟手动切换）。
- **wot 暗色的四个坑（改主题前必读）**：
  1. 暗色下 `--wot-filled-oppo`（卡片）是 `base-black #000000`，而页面底 `--wot-filled-bottom` 是 `coolgrey-10 #1D1F29`——**卡片比背景更黑**，亮色「卡片比底更浅」的层次方向整个反掉，会渲染出一片黑洞。`tokens.css` 已在 `.wot-theme-dark` 覆盖 `--cm-bg-card: var(--wot-coolgrey-9)`，**勿删该覆盖**。同理凹陷色改叠加黑、边框改白色低透明（否则与同为 coolgrey-9 的卡片糊在一起）。注意 `wd-card` / `wd-tabbar` / `wd-dialog` 等 12+ 组件内部直接吃 `--wot-filled-oppo`，仅改 `--cm-bg-card` 救不了它们——`use-theme.ts` 的 themeVars 已在暗色注入 `filledOppo: var(--cm-bg-card)` 整体对齐，**勿删**。
  2. 组件库靠 `wd-config-provider` 的 `theme`（`light`/`dark`）挂 `.wot-theme-dark` class 生效，其 `index.scss` 自带两套语义变量。**主题必须包在页面根**（`DemoTheme`），不能放 App.vue——小程序端页面是独立 Page，App.vue 模板不渲染进页面。
  3. `themeVars` 键名是 camelCase（`primary1`…`primary10`），内部 `kebabCase` 后转成 `--wot-primary-1..10`。暗色下整条色阶须**反转**映射（`primary-N ← brand-(11-N)`），与 wot 自带 dark.scss 同策略；主色同时提亮一档（暗底上 #165DFF 明度不足）。
  4. **CSS 自定义属性按「替换完成后的计算值」继承**：指向 wot 变量的语义 token（如 `--cm-bg-page: var(--wot-filled-bottom)`）若只在亮色块声明，var() 会在亮色作用域就替换冻结，暗色翻转 wot 变量也救不回——**凡引用 `var(--wot-*)` 的 `--cm-*` 必须在 `.wot-theme-dark` 重新声明**，review-lint 已机器拦截。
- **UnoCSS 单位策略**：统一用固定 px（`px-4` = 16px），不用 rem/rpx。`presetRemToPx` 把 wind 工具类的 rem 转成 px，避免 uni-h5 根字号缩放（`width/23.4375`）导致布局失真。三端一致，不随屏幕宽度缩放。
- **`src/manifest.json` 是生成产物，改配置须动 `apps/demo/manifest.config.ts`**：它由 unh 的 `autoGenerate.manifest` 在 dev/build 时前置生成（已 gitignore）。**直接改 `src/manifest.json` 会在下次构建被无声覆盖，且改动不进版本库**——这是 uni-app 生态最常踩的坑（manifest.json 本是著名配置文件）。appid 走 `apps/demo/.env`（`VITE_UNI_APPID`/`VITE_WX_APPID`）。不能改用 vite 插件路线：`@uni-helper/vite-plugin-uni-manifest` 注册为 vite 插件时生成时机晚于 uni 读取 manifest.json，但**该包必须保留**（unh 通过 `isPackageExists` 检测它来启用生成）。
