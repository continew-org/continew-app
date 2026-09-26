# ContiNew App

面向 Vibe Coding 的多端工程脚手架（App / 微信小程序 / H5 / 桌面端）。

[![GitHub](https://img.shields.io/github/stars/continew-org/continew-app?style=social)](https://github.com/continew-org/continew-app)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![CI](https://github.com/continew-org/continew-app/actions/workflows/ci.yml/badge.svg)](https://github.com/continew-org/continew-app/actions/workflows/ci.yml)

📚 [官方文档](https://continew.top) | 💬 [官方交流群](https://continew.top/discussion.html)

## 简介

ContiNew App 是 OpenContiNew 社区的多端工程脚手架，目标平台为 **App（Android/iOS）、微信小程序、H5、桌面端（Tauri，规划中）** 多端一套代码。

它的差异化不在组件，而在**工程治理与 AI 协作**：

- **AI 工程化闭环**：`AGENTS.md` 单一事实源 + 提交前真门禁（lint / typecheck / build），让 AI 写出的代码必须通过机器检查，而不只是文档约束
- **Java 后端友好**：内置独立演示后端（Hono + Zod），统一返回体形状，后续提供 ContiNew Admin 等 Java 后端的对接适配器
- **预封装业务组件**：`Cm*` 薄壳组件 + 组合式函数（请求层 / 会话管理 / 列表三态 / 确认反馈），AI 只能装配不能重写
- **现代技术栈**：uni-app（Vue 3 + Vite + TS strict）+ wot-design-uni + UnoCSS（Tailwind 语法 + wot-\* 设计令牌）+ pnpm catalog 集中版本管理

## 技术栈

| 层 | 选型 |
|:-----|:-----|
| 跨端框架 | uni-app（Vue 3.5 + Vite 5 + TypeScript strict） |
| UI 组件库 | wot-design-uni（Cm* 薄壳封装） |
| 原子化 CSS | UnoCSS（presetWind4 + presetWot + presetApplet） |
| 状态管理 | Pinia |
| 演示后端 | Hono + Zod（独立发展，不依赖 ContiNew Admin） |
| 包管理 | pnpm 12（workspace + catalog 集中版本） |
| 质量门禁 | ESLint（@antfu/eslint-config）+ vue-tsc + 三端构建 |

> 为什么选经典 uni-app 而不是 uni-app x、为什么选 wot-design-uni 而不是 TDesign/Sard，见 [AGENTS.md](AGENTS.md) 技术栈决策一节。

## 快速开始

### 环境要求

- Node.js 22+
- pnpm 12+（推荐 `corepack enable`，仓库 `packageManager` 字段已锁定版本）

### 安装与启动

```bash
# 安装依赖
pnpm install

# 启动演示应用（H5，默认端口 5173，/api 代理到 8080）
pnpm dev:demo

# 启动演示后端（默认端口 8080）
pnpm dev:server

# 微信小程序（编译后导入微信开发者工具）
pnpm dev:mp-weixin

# App（编译后导入 HBuilderX 真机运行）
pnpm dev:app
```

### 环境变量（appid）

H5 与微信小程序**本地开发无需任何 appid**，开箱即跑。只有以下场景才需要配置真实 appid：

- **发布微信小程序** → 需微信小程序 appid（`wx*`，绑定你的小程序主体）
- **App 云端打包 / 开 uni 统计** → 需 uni 应用 appid（`__UNI__*`，DCloud 应用标识）

配置方式（真实值**绝不提交**，`.env` 已被 gitignore）：

```bash
# 复制模板为本地 .env，填入你自己的真实 appid
cp apps/demo/.env.example apps/demo/.env
# 编辑 apps/demo/.env：VITE_UNI_APPID= / VITE_WX_APPID=
```

`src/manifest.json` 由 `manifest.config.ts` 在 dev/build 时自动生成（已 gitignore），请勿手改；appid 从 `.env` 读取。

### 提交前门禁

```bash
# 完整验证：lint + typecheck + 三端构建
pnpm verify

# 快速验证：lint + typecheck
pnpm verify:quick
```

## 项目结构

```
continew-app/
├── apps/
│   └── demo/                 # 演示应用（三端可跑）
├── packages/
│   ├── core/                 # 核心运行时：请求层 / 会话管理 / 组合式函数
│   ├── ui/                   # Cm* 薄壳组件（基于 wot-design-uni）
│   ├── server/               # 独立演示后端（Hono + Zod）
│   └── eslint-config/        # 统一 ESLint 配置（含红线规则）
└── tools/                    # 工程化工具（review-lint 红线扫描器）
```

## Roadmap

骨架已完成开源基座与核心机制，以下方向按优先级演进：

- **业务闭环**：登录页（账号 + 微信一键）、CRUD 列表页、表单页、我的、设置（每个页面都是 AI 可照抄的规范实现）
- **后端对接适配器**：ContiNew Admin 登录/字典/租户约定适配（独立可选包，不强制依赖）
- **工程化增强**：产物冒烟检查、Windows CI runner、release 工作流、依赖更新机器人、`pnpm init:agents` 使用者 skill 模板生成
- **文档站**：VitePress 接入 continew.top

## 项目源码

| 平台 | 地址 |
|:-----|:-----|
| GitHub | [continew-org/continew-app](https://github.com/continew-org/continew-app) |
| AtomGit | [continew/continew-app](https://atomgit.com/continew/continew-app) |
| Gitee | [continew/continew-app](https://gitee.com/continew/continew-app) |

## OpenContiNew 生态

| 项目 | 简介 |
|:-----|:-----|
| [continew-admin](https://github.com/continew-org/continew-admin) | 多租户中后台管理框架（Spring Boot 3 / Java 17） |
| [continew-admin-ui](https://github.com/continew-org/continew-admin-ui) | ContiNew Admin 前端（Vue 3 / Arco Design） |
| [continew-starter](https://github.com/continew-org/continew-starter) | 后端基础能力 Starter 库 |
| **continew-app** | 多端工程脚手架（本仓库） |

## 贡献

欢迎任何形式的贡献，请先阅读 [贡献指南](CONTRIBUTING.md)。提交代码前请确保 `pnpm verify` 三道门禁全部通过。

## License

[Apache-2.0](LICENSE) © 2026-present Charles7c Authors
