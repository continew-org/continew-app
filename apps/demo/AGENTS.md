# apps/demo AGENTS.md

本文件为在演示应用中工作的 AI 智能体提供页面组织细则。通用约定见根目录 [AGENTS.md](../../AGENTS.md)。

## 页面组织

- **路由注册**：每个页面必须在 `src/pages.json` 的 `pages` 数组中注册，`path` 为 `pages/<name>/index`，`navigationBarTitleText` 用中文。
- **页面文件**：`src/pages/<name>/index.vue`，`<script setup lang="ts">`，根容器用 `<view class="px-4 pb-8 pt-4">`。
- **tabbar 页面**：首页 / 组件 / 我的属于 tabbar 页，页面末尾放 `<CmTabBar current="<key>" />`；非 tabbar 页（如详情页）不放。

## 数据获取

- **API 模块**：`src/api/` 按资源建文件（如 `demo.ts`），统一从 `./http` 导入 `http` 请求器；页面不直接 import `@continew-app/core` 的请求方法。
- **列表页**：用 `useList()`（来自 `@continew-app/core`）+ `<CmPage>` 组织「加载 / 错误 / 空」三态，缺一不可；`fetcher` 内调用 `api/` 模块的函数，不写演示数据。
- **详情页**：用 `pickRouteParam('id')` 取路由参数，`safeBack('/pages/<父级>/index')` 兜底返回，**不裸调 `uni.navigateBack`**。

## 交互反馈

- 删除确认用 `confirmDelete()`，成功/失败提示用 `uni.showToast`；**不裸调 `uni.showModal`**。
- 跳转用 `uni.navigateTo`（二级页）或 `uni.switchTab`（tabbar 页）；返回一律走 `safeBack()`。

## 样式

- 优先 Tailwind 语法原子类（`px-4` `text-sm` `flex`），品牌语义色用 `wot-*` 令牌类（`text-color-main` `text-color-secondary`）。
- **统一用固定 px**（`px-4` = 16px），不用 rem/rpx——`presetRemToPx` 已把 wind 工具类转成固定 px，三端一致，不随屏幕宽度缩放。
- **不在 SFC 里写 `<style>` 块**；确需自定义样式时放 `src/styles/*.css` 作全局 CSS 引入。
