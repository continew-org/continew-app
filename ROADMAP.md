# Roadmap

> 版本节奏：**0.2.0 能力完备 → 0.3.0 工程质量基线 → 1.0.0 GA 稳定发布**。
> 全部工作包在 AtomGit 看板跟踪（里程碑 + Issue + 优先级标签）；截止日期为规划占位，不是发布承诺。

## 版本总览

| 版本 | 主题 | 出口标准 | 截止（占位） |
|:-----|:-----|:---------|:-------------|
| 0.2.0 | 能力完备预览（Feature Complete Preview） | 三端跑通真实登录 + CRUD 全链路；core/ui 公共 API 冻结候选 | 2026-12-31 |
| 0.3.0 | 工程质量基线（Engineering Baseline） | 核心包测试纳入门禁；三端产物冒烟全绿；可一键执行发版流程 | 2027-02-28 |
| 1.0.0 | GA 稳定发布（General Availability） | 文档站上线；Admin 适配器交付；公共 API 语义化版本承诺 | 2027-03-31 |

三端 = App（Android/iOS）+ 微信小程序 + H5。桌面端（Tauri）与更多小程序平台列入 1.0+ 展望，不进入当前任何版本范围。

## 0.2.0 — 能力完备预览

**目标**：把「能跑」推进到「能用」。会话契约收口、业务组件层补全、真实登录链路闭环，使脚手架可以直接承载真实业务项目起步。

**工作包**：

| Issue | 工作包 | 优先级 |
|:------|:-------|:-------|
| [#2](https://gitcode.com/continew/continew-app/issues/2) | 固化登录与会话契约，隔离微信演示认证 | p0 |
| [#6](https://gitcode.com/continew/continew-app/issues/6) | 扩展 Cm* 业务组件层与 core 组合式函数 | p0 |
| [#7](https://gitcode.com/continew/continew-app/issues/7) | 微信一键登录真实对接（服务端 code2Session） | p0 |
| [#8](https://gitcode.com/continew/continew-app/issues/8) | 全局异常与错误页规范 | p1 |

**关键依赖**：#2 冻结会话契约后，#6/#7/#8 并行推进。

**非目标**：不引入第二家组件库；不做桌面端；不做 Admin 适配实现（契约冻结在 #5，实现在 #11）。

## 0.3.0 — 工程质量基线

**目标**：把「能用」推进到「敢依赖」。核心包测试、门禁对齐、产物冒烟、发布流水线全部就位，对外发布的每个包都有质量背书。

**工作包**：

| Issue | 工作包 | 优先级 |
|:------|:-------|:-------|
| [#3](https://gitcode.com/continew/continew-app/issues/3) | 完成三端规范演示与交互回归 | p0 |
| [#4](https://gitcode.com/continew/continew-app/issues/4) | 对齐本地与 CI 门禁，补产物冒烟和发布流程 | p1 |
| [#9](https://gitcode.com/continew/continew-app/issues/9) | 建立核心包测试覆盖基线与覆盖率门禁 | p0 |
| [#10](https://gitcode.com/continew/continew-app/issues/10) | 版本发布流水线与三端体积预算 | p1 |

**关键依赖**：#9 依赖 #2 契约冻结；#10 承接 #4 的门禁与冒烟成果。

## 1.0.0 — GA 稳定发布

**目标**：把「敢依赖」推进到「可协作」。文档收口、生态适配器、文档站上线，1.0.0 成为语义化版本承诺起点：core/ui 公共 API 冻结，后续按 semver 演进。

**工作包**：

| Issue | 工作包 | 优先级 |
|:------|:-------|:-------|
| [#5](https://gitcode.com/continew/continew-app/issues/5) | 收口上手文档与可选 Admin 适配边界 | p0 |
| [#11](https://gitcode.com/continew/continew-app/issues/11) | ContiNew Admin 对接适配器（独立可选包） | p0 |
| [#12](https://gitcode.com/continew/continew-app/issues/12) | 文档站：VitePress 接入 continew.top | p1 |
| [#1](https://gitcode.com/continew/continew-app/issues/1) | 总收口：三端工程基线交付与发布决定 | epic |

**关键依赖**：#11/#12 均以 #5 的契约与文档收口为前提。

## 1.0+ 展望（不承诺，启动前先开 Issue 讨论）

- **桌面端**：Tauri 接入（README 已列为规划方向，需先评估 uni-app 桌面端编译链）
- **更多小程序平台**：支付宝 / 抖音小程序适配验证
- **脚手架 CLI**：`pnpm init:agents` 使用者 skill 模板生成、项目模板生成器
- **埋点与统计**：uni 统计或自建轻量埋点规范

## 规则

1. 每个版本出口 = `pnpm verify` 四道门禁全绿 + 各工作包验收标准逐项点验。
2. 工作包状态以 AtomGit 看板为准：[看板入口](https://atomgit.com/org/continew/kanban/3)。
3. 依赖引入与技术栈变更一律先开 Issue 讨论（见 [AGENTS.md](./AGENTS.md)），达成一致后才进入对应版本的看板。
4. 版本发布遵循语义化版本（SemVer）：1.0.0 起 core/ui 公共 API 的破坏性变更须升主版本号。
