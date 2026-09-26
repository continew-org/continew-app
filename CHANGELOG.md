# Changelog

本仓库的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### ✨ 新特性

- 初始化 monorepo 骨架（pnpm workspace + catalog 集中版本管理）
- `@continew-app/core`：统一请求层 / 会话管理 / 组合式函数（useList / confirmDelete / 全局反馈）
- `@continew-app/ui`：Cm* 薄壳组件（CmPage 三态容器 / CmEmpty 空态）
- `@continew-app/server`：独立演示后端（Hono + Zod，统一错误返回体）
- `@continew-app/eslint-config`：统一 ESLint 配置（@antfu/eslint-config 二次定制）
- `apps/demo`：三端演示应用（App / 微信小程序 / H5），含自定义 tabbar、列表三态、后端连通性检查
- UnoCSS 组合 presetWind4 + presetWot + presetApplet（Tailwind 语法 + wot-* 设计令牌 + 小程序转义）
- 提交前门禁：husky + lint-staged + commitlint（Conventional Commits）
- CI：GitHub Actions（lint / typecheck / test / 三端 build + PR 标题语义校验）
- 开源治理基座：CONTRIBUTING / CODE_OF_CONDUCT / SECURITY / CLA / Issue 表单 / PR 模板
